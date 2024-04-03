import { useRouter, usePathname } from "next/navigation";
import { Button } from "./button";
import { MdOutlineArrowBackIos } from "react-icons/md";

const BackButton = () => {
  const router = useRouter();
  const path = usePathname();

  const handleBack = () => {
    const isDynamicRoute = path.split("/").length >= 3;
    // Extract the parent path from the current route
    const parentPath = isDynamicRoute
      ? [path.split("/")[0], path.split("/")[1]].join("/")
      : path.split("/").slice(0, -1).join("/");

    // Navigate back to the parent path
    router.push(parentPath);
  };

  if (path.split("/").length <= 2) return null;

  return (
    <Button variant={"outline"} onClick={handleBack}>
      <MdOutlineArrowBackIos />
    </Button>
  );
};

export default BackButton;
