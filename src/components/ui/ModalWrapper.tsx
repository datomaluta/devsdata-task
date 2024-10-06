import { ReactNode } from "react";
import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ModalWrapper = ({
  closeModal,
  children,
}: {
  children: ReactNode;
  closeModal: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen fixed top-0 left-0 z-40 transition-all"
    >
      <div
        onClick={() => closeModal()}
        className="w-full h-screen fixed bg-black top-0 left-0 z-40 bg-opacity-60"
      ></div>

      <motion.div
        className="bg-neutral-700 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[30rem] rounded-lg px-4 py-12
        w-[90%] z-50  flex flex-col overflow-y-auto"
        initial={{ opacity: 0, y: "-150%", x: "-50%" }}
        animate={{
          opacity: 1,
          y: "-50%",
          x: "-50%",
        }}
        exit={{
          opacity: 0,
          y: "-150%",
        }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => closeModal()}
          className="absolute top-3 right-3 text-gray-400"
        >
          <IoIosCloseCircleOutline className="text-2xl" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ModalWrapper;
