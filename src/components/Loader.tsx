import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={35}
    viewBox="0 0 400 35"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="8" ry="8" width="35" height="35" />

    <rect x="50" y="0" rx="4" ry="4" width="200" height="10" />

    <rect x="50" y="20" rx="4" ry="4" width="120" height="10" />
  </ContentLoader>
);

export default Loader;
