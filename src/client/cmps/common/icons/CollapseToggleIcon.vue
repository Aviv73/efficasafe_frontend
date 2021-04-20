<template>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="38" height="38" viewBox="0 0 38 38">
        <defs>
            <filter id="a" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse">
                <feOffset dy="2" input="SourceAlpha"/>
                <feGaussianBlur stdDeviation="1" result="b"/>
                <feFlood flood-color="#bababa" flood-opacity="0.306"/>
                <feComposite operator="in" in2="b"/>
                <feComposite in="SourceGraphic"/>
            </filter>
        </defs>
        <g transform="translate(-951.375 -532.375)">
            <circle fill="#133146" cx="13.375" cy="13.375" r="13.375" transform="translate(957 536)"/>
            <g filter="url(#a)" transform="matrix(1, 0, 0, 1, 951.38, 532.38)">
                <path
                    fill="#fff"
                    d="M19.375,35.375a16,16,0,1,0-16-16A16,16,0,0,0,19.375,35.375Zm0-18.808-6.238,6.3a1.485,1.485,0,1,1-2.1-2.1L18.4,13.429a1.483,1.483,0,0,1,2.046-.046L27.7,20.613a1.482,1.482,0,1,1-2.092,2.1Z"
                    transform="translate(-0.38 -2.38)"
                />
            </g>
        </g>
    </svg>
</template>

<script>
export default {

}
</script>