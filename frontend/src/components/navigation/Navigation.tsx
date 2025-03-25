import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NavigationItem {
  name: string;
  path: string;
}

interface NavigationProps {
  items: NavigationItem[];
  isScrolled: boolean;
  isTransparent?: boolean;
  className?: string;
}

export const Navigation = ({
  items,
  isScrolled,
  isTransparent = true,
  className = '',
}: NavigationProps) => {
  return (
    <ul className={`flex space-x-20 ${className}`}>
      {items.map((item, index) => (
        <motion.li
          key={item.name}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            to={`/${item.path}`}
            className={`text-lg font-medium transition-colors duration-300 ${
              isScrolled || !isTransparent
                ? 'text-gray-800 hover:text-blue-600'
                : 'text-white hover:text-blue-200'
            }`}
          >
            {item.name}
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}; 