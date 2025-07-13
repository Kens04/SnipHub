import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { LoginForm } from "./_components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="pt-[100px] md:pt-[188px] px-4">
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
