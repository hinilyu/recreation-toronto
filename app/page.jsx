import Search from "@components/search/Search";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <div className="w-full">
        <h1 className="head_text">Discover recreation programs offered by the City of Toronto</h1>
        <Search />
      </div>
    </section>
  );
};

export default Home;
