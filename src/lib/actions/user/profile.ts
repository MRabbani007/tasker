"use server";

import { getCurrentUser } from "@/lib/auth/utils";
import { fail, failData, success } from "../actionResponse";
import { prisma } from "@/lib/prisma";
import { formDataToObject } from "@/lib/helpers";
import { profileSchema } from "@/lib/schemas/profile";
import { UserProfileUpdateInput } from "../../../../generated/prisma/models";

export async function getUserProfile() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, null, "Un-Authorized");
    }

    let temp = await prisma.userProfile.findMany({
      where: { userId: user.id },
    });

    let data = null;
    if (temp.length > 1) {
      data = temp[0];
    }

    if (!data) {
      data = await prisma.userProfile.create({
        data: { user: { connect: { id: user.id } } },
      });
    }

    const dto = { taskListId: data?.taskListId };

    return success(dto);
  } catch (error) {
    console.log(error);
    return failData(500, null, "Server Error");
  }
}

export async function updateUserProfile(formData: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return failData(403, null, "Un-Authorized");
    }

    const raw = formDataToObject(formData as FormData);

    console.log("raw data", raw);

    const result = profileSchema.safeParse(raw);

    if (!result.success) {
      return fail(400, "Missing data");
    }

    const parsed = result.data;

    let foundProfile = await prisma.userProfile.findFirst({
      where: { userId: user.id },
    });

    if (!foundProfile) {
      foundProfile = await prisma.userProfile.create({
        data: { user: { connect: { id: user.id } } },
      });
    }

    const prismaData: UserProfileUpdateInput = {};

    if (parsed?.darkMode) {
      prismaData.darkMode = parsed.darkMode;
    }
    if (parsed?.noteId) {
      prismaData.openNote = { connect: { id: parsed.noteId } };
    }
    if (parsed?.taskListId) {
      prismaData.openTaskList = { connect: { id: parsed.taskListId } };
    }

    console.log("prisma data", prismaData);

    const profile = await prisma.userProfile.update({
      where: { id: foundProfile?.id },
      data: prismaData,
    });

    console.log(profile);

    return success(null);
  } catch (error) {
    console.log(error);
    return fail(500, "Server Error", "Server Error");
  }
}
