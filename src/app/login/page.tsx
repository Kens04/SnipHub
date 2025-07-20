import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { LoginForm } from "./_components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="mt-[100px] md:mt-[158px] mb-[80px] md:mb-[100px] px-4 md:px-8 md:max-w-7xl m-auto">
      <Toaster />
      <h2 className="text-center text-color-text-black text-2xl md:text-3xl font-bold">
        ログイン
      </h2>
      <div className="flex justify-center mt-12">
        <LoginForm />
      </div>
      <div className="text-center mt-5">
        <Link
          href="/signup"
          className="underline text-color-primary transition hover:text-color-primary-hover hover:no-underline"
        >
          アカウントをお持ちでない方はこちら
        </Link>
      </div>
    </div>
  );
};

export default Login;
