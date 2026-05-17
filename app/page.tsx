"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex justify-center items-center">
      <button
        onClick={() => router.push("/canvas")}
        className="bg-gray-400 px-2 py-1 rounded-lg cursor-pointer text-4xl"
      >
        Go to canvas
      </button>
    </div>
  );
}
