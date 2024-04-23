import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

export default function Login() {
  const router = useRouter();

  return (
    <div className="w-full h-[100vh] lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-2 sm:mx-auto grid w-[500px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to Spark</h1>
            <p className="text-balance text-muted-foreground">
              On Spark, you can collaborate with merchants in your area as well as find sponsors to throw the best events and help out the local community.
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              type="submit"
              className="w-"
              onClick={() => {
                void router.push("/api/auth/signin");
              }}
            >
              Login with Square
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/login-image.jpeg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
