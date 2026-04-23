import HackthonPost from "../Components/Hackthon/HackthonPost";
import PublicPage from "../Components/Immersive/PublicPage";

function Hackthon() {
  return (
    <PublicPage className="min-h-screen pt-10 pb-16">
      <HackthonPost />
    </PublicPage>
  );
}

export default Hackthon;
