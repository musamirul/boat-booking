export default function UserCTA (){
  return (
    <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
  <div className="p-8 md:p-12 lg:px-16 lg:py-10">
    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
      <h2 className="text-2xl font-bold text-gray-900 md:text-2xl">
        Lorem, ipsum dolor sit amet consectetur
      </h2>

      <p className="hidden text-gray-500 md:mt-4 md:block">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam
        sed. Quam a scelerisque amet
      </p>

      <div className="mt-4 md:mt-8">
        <a
          href="#"
          className="inline-block rounded-sm bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:ring-3 focus:ring-yellow-400 focus:outline-hidden"
        >
          Book Now
        </a>
      </div>
    </div>
  </div>

  <img
    alt=""
    src="https://images.unsplash.com/photo-1464582883107-8adf2dca8a9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    className="h-65 w-full object-cover"
  />
</section>
  );
}
