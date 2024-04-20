import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";

export default function Login() {
  const router = useRouter();

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to Spark</h1>
            <p className="text-balance text-muted-foreground">
              Square Merchants
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              type="submit"
              className="w-full"
              onClick={() => {
                void router.push("http://localhost:3000/api/auth/signin");
              }}
            >
              Login with Square{" "}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
