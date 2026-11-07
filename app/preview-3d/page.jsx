import HeroSceneLoader from "@/components/three/HeroSceneLoader";

// Preview page: temporary page to check the 3D hero scene on its own
export default function Preview3dPage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-4 py-12 text-center">
      {/* Intro: what this page is for */}
      <h1>3D preview</h1>
      <p className="text-muted text-lead">Clay AC unit and fridge for the CoolFix hero. Move your mouse over the scene.</p>

      {/* Scene: 500px tall area with a transparent canvas, so the page blobs show through */}
      <div className="h-125 w-full max-w-3xl">
        <HeroSceneLoader />
      </div>
    </main>
  );
}
