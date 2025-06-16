import React from 'react';

interface ColorPickerProps {
  colors: ReadonlyArray<string>;
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorChange,
  className = ""
}) => {
  return (
    <div className={`color-picker ${className}`}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`color-option ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          type="button"
          aria-label={`选择颜色 ${color}`}
        />
      ))}
    </div>
  );
};
