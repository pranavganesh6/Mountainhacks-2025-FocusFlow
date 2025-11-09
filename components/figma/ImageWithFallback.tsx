const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4='

interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  style?: { [k: string]: any };
  className?: string;
  [key: string]: any;
}

export function ImageWithFallback({
  src,
  alt = 'Image',
  style,
  className = '',
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = require('react').useState(false)

  const handleError = () => setDidError(true)

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: style?.width ?? 'auto',
          height: style?.height ?? 'auto',
          ...style,
        }}
      >
        <img src={ERROR_IMG_SRC} alt={alt} {...rest} data-original-url={src} />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
}
