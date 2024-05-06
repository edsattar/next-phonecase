import { Star } from "lucide-react";

export const SocialProof = () => {
  return (
    <>
      <div className="flex -space-x-4">
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
          src="/users/user-1.png"
          alt="user image"
        />
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
          src="/users/user-2.png"
          alt="user image"
        />
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
          src="/users/user-3.png"
          alt="user image"
        />
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
          src="/users/user-4.jpg"
          alt="user image"
        />
        <img
          className="inline-block object-cover h-10 w-10 rounded-full ring-2 ring-slate-100"
          src="/users/user-5.jpg"
          alt="user image"
        />
      </div>
      <div className="flex flex-col justify-between items-center sm:items-start">
        <div className="flex gap-0.5">
          <Star className="h-4 w-4 text-green-600 fill-green-600" />
          <Star className="h-4 w-4 text-green-600 fill-green-600" />
          <Star className="h-4 w-4 text-green-600 fill-green-600" />
          <Star className="h-4 w-4 text-green-600 fill-green-600" />
          <Star className="h-4 w-4 text-green-600 fill-green-600" />
        </div>
        <p>
          <span className="font-semibold">1.250</span> happy customers
        </p>
      </div>
    </>
  );
};
