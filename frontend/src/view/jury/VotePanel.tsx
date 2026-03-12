import { Button } from "../../components/ui/button";

export function VotePanel() {
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Mon vote</h2>
      <Button variant="default" size="lg" className="mt-4">
        <span role="img" aria-label="valider">
          ✓
        </span>{" "}
        Valider
      </Button>
    </div>
  );
}
