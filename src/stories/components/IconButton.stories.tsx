import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP } from '../utils/phosphorIcons';
import { IconPickerInline } from '../utils/IconPickerInline';
import { IconButton } from '../../components/ui/IconButton';

const SIZE_PX = { sm: 10, md: 12, lg: 14 } as const;

function resolveIcon(name: string, size: number) {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={size} weight="bold" /> : null;
}

// ─── Playground wrapper ────────────────────────────────────────────────────────
function IconButtonPlaygroundWrapper({
  size, variant, showIndicator, dropdown, disabled, label,
}: {
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'active';
  showIndicator: boolean;
  dropdown: boolean;
  disabled: boolean;
  label: string;
}) {
  const [iconName, setIconName] = useState<string | null>('MagnifyingGlass');
  const sizePx = SIZE_PX[size] ?? 12;
  const icon = iconName
    ? (resolveIcon(iconName, sizePx) ?? resolveIcon('MagnifyingGlass', sizePx)!)
    : resolveIcon('MagnifyingGlass', sizePx)!;

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <IconButton
        icon={icon}
        label={label}
        size={size}
        variant={variant}
        showIndicator={showIndicator}
        dropdown={dropdown}
        disabled={disabled}
      />

      <div className="w-72 rounded-lg border border-[#eef1f6] bg-white p-4 flex flex-col gap-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Icon</p>
        <IconPickerInline value={iconName} onChange={setIconName} label="Icon" />
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Icon-only button. Use the icon picker in the canvas to choose any Phosphor icon.',
      },
    },
  },
  argTypes: {
    size:          { control: 'radio',   options: ['sm', 'md', 'lg'] },
    variant:       { control: 'radio',   options: ['default', 'active'] },
    showIndicator: { control: 'boolean' },
    dropdown:      { control: 'boolean' },
    disabled:      { control: 'boolean' },
    label:         { control: 'text' },
    icon:          { table: { disable: true } },
  },
  args: {
    label: 'Action',
    size: 'md',
    variant: 'default',
    showIndicator: false,
    dropdown: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <IconButtonPlaygroundWrapper
      size={args.size ?? 'md'}
      variant={args.variant ?? 'default'}
      showIndicator={args.showIndicator ?? false}
      dropdown={args.dropdown ?? false}
      disabled={args.disabled ?? false}
      label={String(args.label ?? 'Action')}
    />
  ),
};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {(['default', 'active'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">{variant}</p>
          <div className="flex items-end gap-6">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-1.5">
                <IconButton icon={resolveIcon('MagnifyingGlass', SIZE_PX[size])!} label="Search" size={size} variant={variant} />
                <span className="text-[9px] text-[#858c9b]">{size}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CommonIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const icons = [
      'MagnifyingGlass','FunnelSimple','PencilSimple','Trash','DownloadSimple',
      'ArrowCounterClockwise','Gear','DotsThree','X','Plus','Bell','ArrowRight',
      'Copy','Share','Upload','Link','Lock','Eye','EyeSlash','Star',
      'Heart','Bookmark','Flag','Tag','Clock','Calendar','User','Users',
    ];
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Default</p>
          <div className="flex flex-wrap gap-2">
            {icons.map((name) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <IconButton icon={resolveIcon(name, 12)!} label={name} />
                <span className="text-[8px] text-[#858c9b] max-w-[48px] truncate text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Active</p>
          <div className="flex flex-wrap gap-2">
            {['FunnelSimple','MagnifyingGlass','Bell','Gear','Star','Bookmark'].map((name) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <IconButton icon={resolveIcon(name, 12)!} label={name} variant="active" />
                <span className="text-[8px] text-[#858c9b] max-w-[48px] truncate text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

export const IndicatorAndDropdown: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-end gap-8 p-6">
      {[
        { label: 'indicator', showIndicator: true,  dropdown: false, iconName: 'Bell' },
        { label: 'dropdown',  showIndicator: false, dropdown: true,  iconName: 'FunnelSimple' },
        { label: 'both',      showIndicator: true,  dropdown: true,  iconName: 'DotsThree' },
        { label: 'active+dot',showIndicator: true,  dropdown: false, iconName: 'MagnifyingGlass', variant: 'active' as const },
      ].map(({ label, iconName, variant = 'default', ...rest }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <IconButton icon={resolveIcon(iconName, 12)!} label={label} variant={variant} {...rest} />
          <span className="text-[9px] text-[#858c9b]">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4 p-6">
      {['MagnifyingGlass','FunnelSimple','PencilSimple','Trash'].map((name) => (
        <IconButton key={name} icon={resolveIcon(name, 12)!} label={name} disabled />
      ))}
      <IconButton icon={resolveIcon('FunnelSimple', 12)!} label="Active" variant="active" disabled />
    </div>
  ),
};
