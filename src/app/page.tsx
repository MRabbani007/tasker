import Carousel from "@/components/Carousel";
import Link from "next/link";

const slides = [
  { title: "Tasks", text: "quick add & track" },
  { title: "Activities", text: "a place for your projects" },
  { title: "Routines", text: "repeating tasks" },
  { title: "Planner", text: "organize, plan & action" },
  { title: "Calendar", text: "what's comming up" },
  { title: "Journal", text: "your daily diary" },
  { title: "Notes", text: "fast & simple" },
  { title: "Filters", text: "overview, filter & sort" },
  { title: "Lists", text: "group your tasks" },
];

export default function HomePage() {
  const user = null;

  return (
    <main>
      <section className="min-h-[85vh] flex flex-col items-center justify-center lg:flex-row gap-x-8 gap-y-4 lg:mx-auto">
        <div className="flex flex-col justify-center items-start">
          <div className="flex flex-wrap justify-center items-center gap-4 ">
            <img
              src="logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="from-zinc-500/80 to-zinc-500/50 bg-linear-to-br rounded-full p-2 mx-auto hover:scale-110 hover:-rotate-12 duration-100 w-20 h-20"
            />
            <div>
              <h1 className="m-0 p-0 text-2xl sm:text-7xl uppercase text-sky-700 font-extrabold">
                Taskit
              </h1>
              <div className="sm:hidden font-medium text-sm text-zinc-900/70 text-wrap">
                Your Daily Adventure Starts Here
              </div>
            </div>
          </div>
          <div className="hidden sm:inline-block font-medium text-sm sm:text-2xl text-zinc-900/80 text-wrap">
            Your Daily Adventure Starts Here
          </div>
          <div className="hidden sm:inline-block font-bold text-zinc-800/70 mb-2">
            A place to organize your day and keep track of your activities
          </div>
          <div className="flex items-center justify-center gap-2 mx-auto mt-4">
            {user ? (
              <Link href={"/dashboard"} className="btn btn-blue">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-blue">
                  Sign in
                </Link>
                <span>or</span>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <section className="max-w-[80vw] sm:max-w-[500px] md:max-w-[700px] overflow-hidden">
            <Carousel autoplay autoplaySpeed={3000}>
              {slides.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="flex flex-col justify-center bg-linear-to-br from-sky-500 to-sky-800 text-white h-[300px] rounded-xl text-center gap-6">
                      <p
                        className="text-5xl font-bold uppercase"
                        // style={{ lineHeight: "200px" }}
                      >
                        {item.title}
                      </p>
                      <p className="text-2xl font-medium uppercase">
                        <i>{item.text}</i>
                      </p>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </section>
        </div>
      </section>
    </main>
  );
}
