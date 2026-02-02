type ActionResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  error?: string;
};

type ActionResponseWithData<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
  count?: number;
  error?: string;
};

export function success<T>(
  data: T,
  message = "Success",
  count?: number
): ActionResponseWithData<T> {
  return {
    status: 200,
    success: true,
    message,
    data,
    count,
  };
}

export type Success<T> = {
  ok: true;
  data: T;
};

export function created<T>(
  data: T,
  message = "Created"
): ActionResponseWithData<T> {
  return {
    status: 201,
    success: true,
    message,
    data,
    count: 1,
  };
}

export function fail<T>(
  status: number,
  message: string,
  error?: string
): ActionResponse<T> {
  return {
    status,
    success: false,
    count: 0,
    message,
    error,
  };
}

export function failData<T>(
  status: number,
  data: T,
  message: string,
  error?: string
): ActionResponseWithData<T> {
  return {
    status,
    data,
    success: false,
    count: 0,
    message,
    error,
  };
}
