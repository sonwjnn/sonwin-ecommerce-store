import { cn } from '@/lib/utils'

const CheckIcon = ({ className, size = 16 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
  )
}

const HeartIcon = ({ className = '' }) => {
  return (
    <svg
      className={`${className} heart-icon`}
      enableBackground="new 467 392 58 57"
      viewBox="467 392 58 57"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id="Group"
        fill="none"
        fillRule="evenodd"
        transform="translate(467 392)"
      >
        <path
          d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
          id="heart"
          fill="#AAB8C2"
        />
        <circle
          id="main-circ"
          fill="#E2264D"
          opacity="0"
          cx="29.5"
          cy="29.5"
          r="1.5"
        />

        <g id="grp7" opacity="0" transform="translate(7 6)">
          <circle id="oval1" fill="#FF6347" cx="2" cy="6" r="2" />
          <circle id="oval2" fill="#FF4500" cx="5" cy="2" r="2" />
        </g>

        <g id="grp6" opacity="0" transform="translate(0 28)">
          <circle id="oval1" fill="#FF6347" cx="2" cy="7" r="2" />
          <circle id="oval2" fill="#FF4500" cx="3" cy="2" r="2" />
        </g>

        <g id="grp3" opacity="0" transform="translate(52 28)">
          <circle id="oval2" fill="#FF6347" cx="2" cy="7" r="2" />
          <circle id="oval1" fill="#FF4500" cx="4" cy="2" r="2" />
        </g>

        <g id="grp2" opacity="0" transform="translate(44 6)">
          <circle id="oval2" fill="#FF6347" cx="5" cy="6" r="2" />
          <circle id="oval1" fill="#FF4500" cx="2" cy="2" r="2" />
        </g>

        <g id="grp5" opacity="0" transform="translate(14 50)">
          <circle id="oval1" fill="#FFA500" cx="6" cy="5" r="2" />
          <circle id="oval2" fill="#FF6347" cx="2" cy="2" r="2" />
        </g>

        <g id="grp4" opacity="0" transform="translate(35 50)">
          <circle id="oval1" fill="#FFA500" cx="6" cy="5" r="2" />
          <circle id="oval2" fill="#FF6347" cx="2" cy="2" r="2" />
        </g>

        <g id="grp1" opacity="0" transform="translate(24)">
          <circle id="oval1" fill="#FFA500" cx="2.5" cy="3" r="2" />
          <circle id="oval2" fill="#FF6347" cx="7.5" cy="2" r="2" />
        </g>
      </g>
    </svg>
  )
}

export { HeartIcon, CheckIcon }
