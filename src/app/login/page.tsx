import SignInForm from "@/components/ui/signInForm";
import { ModeToggle } from "@/components/ui/toggle-mode";

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className=" absolute top-12 right-12">
        <ModeToggle />
      </div>
      <div className="w-96">
        <SignInForm />
      </div>
    </div>
  );
}
