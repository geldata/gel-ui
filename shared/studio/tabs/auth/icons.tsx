import cn from "@edgedb/common/utils/classNames";

import styles from "./authAdmin.module.scss";

export function GenerateKeyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.5 10C10.8807 10 12 8.88071 12 7.5C12 6.11929 10.8807 5 9.5 5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10ZM9.5 10V12.5M11.5 15H9.5V12.5M9.5 12.5H11.5M2.925 6.50001C3.34764 5.30567 4.06594 4.23785 5.01289 3.39619C5.95983 2.55454 7.10455 1.96648 8.34024 1.68689C9.57592 1.4073 10.8623 1.4453 12.0793 1.79732C13.2964 2.14935 14.4044 2.80394 15.3 3.70001L19.1667 7.33334M19.1667 7.33334L19.1667 2.33334M19.1667 7.33334L14.1667 7.33334M0.833332 12.6667L4.7 16.3C5.59562 17.1961 6.70364 17.8507 7.92067 18.2027C9.1377 18.5547 10.4241 18.5927 11.6598 18.3131C12.8954 18.0335 14.0402 17.4455 14.9871 16.6038C15.9341 15.7622 16.6524 14.6944 17.075 13.5M0.833332 12.6667V17.6667M0.833332 12.6667L5.83333 12.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg
      className={cn(styles.oauthIcon, styles.appleIcon)}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path d="M26.1654 9.86429C26.0129 9.9813 23.3197 11.4816 23.3197 14.8178C23.3197 18.6766 26.7467 20.0417 26.8493 20.0755C26.8335 20.1587 26.3048 21.9451 25.0424 23.7653C23.9167 25.367 22.741 26.9662 20.9525 26.9662C19.1641 26.9662 18.7038 25.9391 16.6392 25.9391C14.6271 25.9391 13.9117 27 12.2758 27C10.6399 27 9.4984 25.5179 8.18597 23.6977C6.66576 21.5603 5.4375 18.2397 5.4375 15.0882C5.4375 10.0333 8.76197 7.35244 12.0338 7.35244C13.7723 7.35244 15.2215 8.48095 16.313 8.48095C17.3519 8.48095 18.9721 7.28483 20.9499 7.28483C21.6995 7.28483 24.3927 7.35243 26.1654 9.86429ZM20.011 5.14481C20.8289 4.18532 21.4076 2.85399 21.4076 1.52265C21.4076 1.33803 21.3918 1.15082 21.3576 1C20.0267 1.0494 18.4434 1.87629 17.4887 2.971C16.7391 3.81348 16.0395 5.14481 16.0395 6.49435C16.0395 6.69717 16.0737 6.89999 16.0895 6.965C16.1736 6.9806 16.3104 6.9988 16.4472 6.9988C17.6412 6.9988 19.143 6.20832 20.011 5.14481Z" />
    </svg>
  );
}

export function AzureIcon() {
  return (
    <svg
      className={styles.oauthIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M11.9465 5.00027H19L11.6778 26.2507C11.6025 26.469 11.4592 26.6588 11.2681 26.7932C11.077 26.9276 10.8476 26.9999 10.6124 27H5.12298C4.94471 27 4.76899 26.9585 4.61037 26.8788C4.45175 26.7991 4.31478 26.6835 4.2108 26.5417C4.10681 26.3998 4.0388 26.2358 4.01239 26.0631C3.98598 25.8904 4.00193 25.714 4.05891 25.5486L10.8808 5.74959C10.956 5.53114 11.0993 5.3413 11.2905 5.20683C11.4817 5.07235 11.7111 5.00028 11.9465 5.00027Z"
        fill="url(#paint0_linear_42_53)"
      />
      <path
        d="M22.3339 20H11.5019C11.4012 19.9999 11.3028 20.0275 11.2195 20.0793C11.1362 20.131 11.0719 20.2045 11.035 20.2901C10.998 20.3757 10.9901 20.4695 11.0124 20.5593C11.0346 20.6491 11.0859 20.7307 11.1595 20.7934L18.1199 26.7312C18.3226 26.904 18.5894 27.0001 18.8665 27H25L22.3339 20Z"
        fill="#0078D4"
      />
      <path
        d="M11.9749 5.00001C11.7361 4.99911 11.5032 5.07276 11.3103 5.2102C11.1174 5.34764 10.9746 5.54167 10.9028 5.76394L4.06613 25.5305C4.00508 25.6966 3.98591 25.8745 4.01025 26.0494C4.03459 26.2242 4.10171 26.3907 4.20595 26.5348C4.31019 26.679 4.44847 26.7965 4.60909 26.8775C4.76972 26.9585 4.94797 27.0005 5.12875 27H10.781C10.9915 26.9633 11.1882 26.8727 11.3511 26.7375C11.514 26.6023 11.6372 26.4274 11.7082 26.2305L13.0715 22.3095L17.9415 26.7421C18.1455 26.9068 18.4015 26.9979 18.6664 27H25L22.2222 19.2535L14.1244 19.2554L19.0805 5.00001H11.9749Z"
        fill="url(#paint1_linear_42_53)"
      />
      <path
        d="M21.0345 5.74826C20.9585 5.53016 20.8136 5.34064 20.6204 5.2064C20.4272 5.07216 20.1953 4.99997 19.9574 5H12C12.2379 5.00001 12.4697 5.07222 12.663 5.20645C12.8562 5.34069 13.001 5.53018 13.0771 5.74826L19.9829 25.5481C20.0406 25.7135 20.0568 25.8899 20.0301 26.0627C20.0034 26.2354 19.9345 26.3995 19.8293 26.5414C19.724 26.6833 19.5854 26.7989 19.4248 26.8786C19.2642 26.9584 19.0863 27 18.9058 27H26.8635C27.0439 26.9999 27.2218 26.9583 27.3824 26.8786C27.5429 26.7988 27.6815 26.6832 27.7868 26.5413C27.892 26.3994 27.9608 26.2353 27.9875 26.0626C28.0142 25.8899 27.998 25.7135 27.9403 25.5481L21.0345 5.74826Z"
        fill="url(#paint2_linear_42_53)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_42_53"
          x1="14.5173"
          y1="6.63052"
          x2="7.45977"
          y2="27.9164"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#114A8B" />
          <stop offset="1" stopColor="#0669BC" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_42_53"
          x1="16.8522"
          y1="16.5088"
          x2="15.1601"
          y2="17.0951"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0.3" />
          <stop offset="0.071" stopOpacity="0.2" />
          <stop offset="0.321" stopOpacity="0.1" />
          <stop offset="0.623" stopOpacity="0.05" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_42_53"
          x1="15.8903"
          y1="6.01201"
          x2="23.572"
          y2="27.1618"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3CCBF4" />
          <stop offset="1" stopColor="#2892DF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DiscordIcon() {
  return (
    <svg
      className={styles.oauthIcon}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.308 6.84247C24.4227 5.96933 22.4323 5.3499 20.3879 5C20.1081 5.50591 19.8549 6.02642 19.6295 6.55936C17.4517 6.2274 15.2371 6.2274 13.0593 6.55936C12.8338 6.02648 12.5806 5.50597 12.301 5C10.2552 5.35286 8.26356 5.97376 6.37632 6.84703C2.62968 12.4543 1.61403 17.9224 2.12186 23.3128C4.31598 24.9526 6.77184 26.1998 9.38266 27C9.97054 26.2002 10.4907 25.3517 10.9377 24.4635C10.0887 24.1427 9.26929 23.747 8.48889 23.2808C8.69428 23.1301 8.89515 22.9749 9.08925 22.8242C11.36 23.9044 13.8385 24.4645 16.3478 24.4645C18.8571 24.4645 21.3356 23.9044 23.6064 22.8242C23.8027 22.9863 24.0036 23.1416 24.2067 23.2808C23.4248 23.7477 22.6039 24.1442 21.7533 24.4658C22.1998 25.3535 22.72 26.2013 23.3084 27C25.9215 26.203 28.3792 24.9564 30.5737 23.3151C31.1696 17.0639 29.5558 11.6461 26.308 6.84247ZM11.581 19.9977C10.1658 19.9977 8.99672 18.6986 8.99672 17.1005C8.99672 15.5023 10.1252 14.1918 11.5765 14.1918C13.0277 14.1918 14.1878 15.5023 14.163 17.1005C14.1382 18.6986 13.0232 19.9977 11.581 19.9977ZM21.1146 19.9977C19.6972 19.9977 18.5326 18.6986 18.5326 17.1005C18.5326 15.5023 19.6611 14.1918 21.1146 14.1918C22.5681 14.1918 23.7192 15.5023 23.6944 17.1005C23.6696 18.6986 22.5568 19.9977 21.1146 19.9977Z"
        fill="#5865F2"
      />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg
      className={cn(styles.oauthIcon, styles.githubIcon)}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9613 3C8.79402 3 3 8.83674 3 16.0576C3 21.8296 6.71243 26.7155 11.8626 28.4447C12.5064 28.5747 12.7423 28.1638 12.7423 27.8181C12.7423 27.5153 12.7211 26.4777 12.7211 25.3966C9.11557 26.175 8.36476 23.8401 8.36476 23.8401C7.78533 22.3268 6.9268 21.9378 6.9268 21.9378C5.74671 21.1379 7.01276 21.1379 7.01276 21.1379C8.32178 21.2244 9.00865 22.4782 9.00865 22.4782C10.1672 24.467 12.0342 23.9051 12.7853 23.5591C12.8925 22.716 13.236 22.1323 13.6008 21.8081C10.7252 21.5054 7.69963 20.3813 7.69963 15.3657C7.69963 13.9388 8.21433 12.7715 9.02988 11.8636C8.9012 11.5394 8.45045 10.1988 9.15882 8.40455C9.15882 8.40455 10.2532 8.05859 12.7208 9.74488C13.7773 9.45905 14.8668 9.31365 15.9613 9.31243C17.0557 9.31243 18.1713 9.46392 19.2015 9.74488C21.6693 8.05859 22.7637 8.40455 22.7637 8.40455C23.4721 10.1988 23.0211 11.5394 22.8924 11.8636C23.7294 12.7715 24.2229 13.9388 24.2229 15.3657C24.2229 20.3813 21.1973 21.4836 18.3002 21.8081C18.7724 22.2188 19.18 22.9969 19.18 24.2293C19.18 25.9803 19.1587 27.3856 19.1587 27.8178C19.1587 28.1638 19.3949 28.5747 20.0385 28.445C25.1886 26.7152 28.901 21.8296 28.901 16.0576C28.9223 8.83674 23.107 3 15.9613 3Z"
      />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg
      className={styles.oauthIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M28.48 16.2955C28.48 15.3736 28.3973 14.4873 28.2436 13.6364H16V18.6709H22.9964C22.6891 20.29 21.7673 21.6609 20.3845 22.5827V25.8564H24.6036C27.0618 23.5873 28.48 20.2545 28.48 16.2955Z"
        fill="#4285F4"
      />
      <path
        d="M16 29C19.51 29 22.4527 27.8418 24.6036 25.8564L20.3845 22.5827C19.2263 23.3627 17.7491 23.8355 16 23.8355C12.62 23.8355 9.74817 21.5545 8.71999 18.4818H4.39453V21.8382C6.53362 26.0809 10.9182 29 16 29Z"
        fill="#34A853"
      />
      <path
        d="M8.72 18.47C8.46 17.69 8.30636 16.8627 8.30636 16C8.30636 15.1373 8.46 14.31 8.72 13.53V10.1736H4.39455C3.50818 11.9227 3 13.8964 3 16C3 18.1036 3.50818 20.0773 4.39455 21.8264L7.76273 19.2027L8.72 18.47Z"
        fill="#FBBC05"
      />
      <path
        d="M16 8.17636C17.9145 8.17636 19.6163 8.83818 20.9754 10.1145L24.6982 6.39182C22.4409 4.28818 19.51 3 16 3C10.9182 3 6.53362 5.91909 4.39453 10.1736L8.71999 13.53C9.74817 10.4573 12.62 8.17636 16 8.17636Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SlackIcon() {
  return (
    <svg
      className={styles.oauthIcon}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.46254 19.43C8.46254 20.9332 7.23453 22.1612 5.73127 22.1612C4.22801 22.1612 3 20.9332 3 19.43C3 17.9267 4.22801 16.6987 5.73127 16.6987H8.46254V19.43Z"
        fill="#E01E5A"
      />
      <path
        d="M9.83875 19.43C9.83875 17.9267 11.0668 16.6987 12.57 16.6987C14.0733 16.6987 15.3013 17.9267 15.3013 19.43V26.2687C15.3013 27.772 14.0733 29 12.57 29C11.0668 29 9.83875 27.772 9.83875 26.2687V19.43Z"
        fill="#E01E5A"
      />
      <path
        d="M12.57 8.46254C11.0668 8.46254 9.83875 7.23453 9.83875 5.73127C9.83875 4.22801 11.0668 3 12.57 3C14.0733 3 15.3013 4.22801 15.3013 5.73127V8.46254H12.57Z"
        fill="#36C5F0"
      />
      <path
        d="M12.57 9.83881C14.0733 9.83881 15.3013 11.0668 15.3013 12.5701C15.3013 14.0733 14.0733 15.3013 12.57 15.3013H5.73127C4.22801 15.3013 3 14.0733 3 12.5701C3 11.0668 4.22801 9.83881 5.73127 9.83881H12.57Z"
        fill="#36C5F0"
      />
      <path
        d="M23.5375 12.5701C23.5375 11.0668 24.7655 9.83881 26.2688 9.83881C27.772 9.83881 29 11.0668 29 12.5701C29 14.0733 27.772 15.3013 26.2688 15.3013H23.5375V12.5701Z"
        fill="#2EB67D"
      />
      <path
        d="M22.1612 12.57C22.1612 14.0733 20.9332 15.3013 19.43 15.3013C17.9267 15.3013 16.6987 14.0733 16.6987 12.57V5.73127C16.6987 4.22801 17.9267 3 19.43 3C20.9332 3 22.1612 4.22801 22.1612 5.73127V12.57Z"
        fill="#2EB67D"
      />
      <path
        d="M19.4299 23.5374C20.9332 23.5374 22.1612 24.7654 22.1612 26.2686C22.1612 27.7719 20.9332 28.9999 19.4299 28.9999C17.9267 28.9999 16.6987 27.7719 16.6987 26.2686V23.5374H19.4299Z"
        fill="#ECB22E"
      />
      <path
        d="M19.4299 22.1612C17.9267 22.1612 16.6987 20.9332 16.6987 19.43C16.6987 17.9267 17.9267 16.6987 19.4299 16.6987H26.2687C27.772 16.6987 29 17.9267 29 19.43C29 20.9332 27.772 22.1612 26.2687 22.1612H19.4299Z"
        fill="#ECB22E"
      />
    </svg>
  );
}
