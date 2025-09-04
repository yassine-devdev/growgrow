import React from 'react';
import { icons } from 'lucide-react';

/**
 * @typedef {object} IconProps
 * @property {keyof typeof icons} name - The name of the icon from the `lucide-react` library.
 * @property {string} [className] - Optional CSS classes to apply to the icon.
 * @property {number} [size=24] - Optional size for the icon. Defaults to 24.
 */
interface IconProps {
  name: keyof typeof icons;
  className?: string;
  size?: number;
}

/**
 * A dynamic icon component that renders an icon from the `lucide-react` library based on a string name.
 * This allows for easy rendering of icons without needing to import each one individually.
 *
 * @param {IconProps} props - The component props.
 * @returns {JSX.Element | null} The rendered Lucide icon, or null if the icon name is not found.
 */
const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return <></>;
  }

  return <LucideIcon className={className} size={size} />;
};

export default Icon;