import React from "react";
import { motion } from "framer-motion";
import { FaTractor } from "react-icons/fa";

export const LoadingAnimation=()=>{
    return (<div className="inline-block w-5 h-5 border-2 border-t-2 border-r-transparent border-green-500 rounded-full animate-spin "></div>
    );
};

export const Loading=()=>{
    return (
        <div className=" flex items-center justify-center max-h-screen mt-36 ">
            <div className=" animate-spin rounded-full h-14 w-14 border-t-4 border-green-500 " ></div>
        </div>
    );
};



export const FarmLoadingAnimation = () => {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <FaTractor className="text-green-600 text-2xl" />
    </motion.div>
  );
};
