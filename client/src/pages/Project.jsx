import CallToAction from "../components/CallToAction";

const Project = () => {
  return (
    <div className="min-h-screen p-3 max-w-4xl mx-auto flex flex-col justify-center items-center gap-5">
      <h1 className="text-3xl text-slate-900 text-center dark:text-slate-300 font-semibold">
        Projects
      </h1>
      <p className="text-gray-500">
        Build fun and engaging projects while learning HTML, CSS, and
        JavaScript!
      </p>
      <CallToAction />
    </div>
  );
};

export default Project;
