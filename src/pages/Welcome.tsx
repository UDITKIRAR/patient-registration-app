import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const WelcomePage = () => {
  return (
    <motion.div
      className="py-10 flex flex-col justify-center px-6  max-w-3xl mx-auto"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-center text-gray-700"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        Welcome to the Patient Registration App
      </motion.h1>

      <motion.p
        className="mb-6 text-lg text-gray-700 text-center"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        This frontend-only app uses <strong>Pglite</strong> for data storage and lets you:
      </motion.p>

      <motion.ul
        className="list-disc list-inside mb-5 text-gray-700 space-y-3"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <li><strong>Register new patients</strong> with their details.</li>
        <li><strong>Query patient records</strong> directly using raw SQL.</li>
        <li><strong>Persist patient data</strong> across page refreshes automatically.</li>
        <li>Use the app in multiple browser tabs with real-time synchronization of data.</li>
      </motion.ul>

      <motion.p
        className="mb-12 text-gray-600 text-center"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        Use the sidebar options to start registering patients, querying records, or viewing the full patient list.
      </motion.p>

      <motion.p
        className="text-center text-sm text-gray-500 italic"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        Developed as part of the Medblocks frontend coding challenge. <br />
        Developed with ❤️ by <span className="not-italic font-medium text-gray-600">Udit Kirar</span>.
      </motion.p>
    </motion.div>
  );
};

export default WelcomePage;
