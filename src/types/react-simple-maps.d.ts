declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode, CSSProperties, MouseEvent } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    style?: CSSProperties
    className?: string
    children?: ReactNode
  }
  export const ComposableMap: ComponentType<ComposableMapProps>

  export interface GeographiesProps {
    geography: string | object
    children: (args: { geographies: any[] }) => ReactNode
  }
  export const Geographies: ComponentType<GeographiesProps>

  export interface GeographyProps {
    geography: any
    onMouseEnter?: (e: MouseEvent<SVGPathElement>) => void
    onMouseLeave?: (e: MouseEvent<SVGPathElement>) => void
    onClick?: (e: MouseEvent<SVGPathElement>) => void
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
    fill?: string
    stroke?: string
    strokeWidth?: number
  }
  export const Geography: ComponentType<GeographyProps>
}
