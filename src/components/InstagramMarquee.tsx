import { motion } from 'framer-motion';

interface InstagramPost {
  href: string;
  image: string;
  alt: string;
  likes?: string;
}

interface InstagramMarqueeProps {
  posts: InstagramPost[];
  baseUrl: string;
}

export default function InstagramMarquee({ posts, baseUrl }: InstagramMarqueeProps) {
  // Duplicate posts for seamless loop
  const duplicatedPosts = [...posts, ...posts, ...posts];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{
          x: ['0%', '-33.333%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedPosts.map((post, index) => (
          <a
            key={index}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[4/5] w-[200px] md:w-[250px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={`${baseUrl}assets/${post.image}`}
              alt={post.alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                className="drop-shadow-lg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {post.likes && <span className="text-white font-bold text-sm">{post.likes}</span>}
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  );
}

