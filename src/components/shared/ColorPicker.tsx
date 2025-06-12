import React from 'react';

interface ColorPickerProps {
  colors: ReadonlyArray<string>;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  className = ""
}) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`apple-color-option ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
