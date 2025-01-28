<template>
	<div id="center-wrap">
		<div id="loader">
			<div class="ball-wrap">
				<div class="ball"><div></div></div>
			</div>
			<div class="ball-wrap">
				<div class="ball"><div></div></div>
			</div>
			<div class="ball-wrap">
				<div class="ball"><div></div></div>
			</div>
			<div class="ball-wrap">
				<div class="ball"><div></div></div>
			</div>
			<div class="ball-wrap">
				<div class="ball"><div></div></div>
			</div>
		</div>

		<div class="text-wrap">
			<BaseFetching :text="text" :failText="failText" :error="error" />
		</div>
	</div>
</template>

<script setup lang="ts">
// Components
import BaseFetching from '@/components/BaseFetching.vue'

// Props
defineProps<{
	text?: string
	failText?: string
	error?: boolean
}>()
</script>

<style lang="scss" scoped>
/**
 * Content centering
 */

#center-wrap {
	flex: 1;
	display: flex;
	gap: 40px;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: calc(100vh - 5rem);
	// border: solid 1px pink;
}
#center-wrap .text-wrap {
	text-wrap: nowrap;
	// background: orange;
}

/**
 * Loader
 */

#loader {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	position: relative;
	// border: dashed 1px $black-05;
	// background: #eee;
}
#loader::before {
	content: '';
	display: block;
	width: 20px;
	height: 20px;
	margin: -10px;
	border-radius: 50%;
	position: absolute;
	left: 50%;
	top: 50%;
	background: #eee;
	border: solid 1px $black-10;
	animation: shake-large 1s infinite;
}
#loader::after {
	content: '';
	display: block;
	width: 50px;
	height: 50px;
	margin: -25px;
	border-radius: 50%;
	position: absolute;
	left: 50%;
	top: 50%;
	border: dashed 1px $black-05;
	animation: shake-large 1.5s infinite;
}
#loader .ball-wrap {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	perspective: 200px;
	// border: solid 1px green;
}
#loader .ball {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	position: absolute;
	top: 50%;
	right: 0;
	margin: -5px;
	transform-origin: -45px 0;
	transform-style: preserve-3d;
	// border: solid 1px green;
}
#loader .ball div {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: solid 1px $black-10;
}

#loader .ball-wrap .ball {
	// border: solid 3px black;
}

/**
 * Balls
 */

// Speed
$sp-1: 4s;
$sp-2: 5s;
$sp-3: 6s;
$sp-4: 7s;
$sp-5: 8s;

// Rotation
$ro-1: 10deg; // 0deg + 10
$ro-2: 226deg; // 216deg + 10
$ro-3: 298deg; // 288deg + 10
$ro-4: 154deg; // 144deg + 10
$ro-5: 82deg; // 72deg + 10

// Color
$co-1: #555;
$co-2: #333;
$co-3: #666;
$co-4: #444;
$co-5: #777;

$co-1: #fafafa;
$co-2: #fafafa;
$co-3: #fafafa;
$co-4: #fafafa;
$co-5: #fafafa;

// // For debugging
// $co-1: orange;
// $co-2: blue;
// $co-3: purple;
// $co-4: orange;
// $co-5: green;

// Ball #1
#loader .ball-wrap:nth-child(1) {
	animation:
		z1 $sp-1 infinite linear,
		ornt-1 $sp-1 infinite linear;
	// transform: rotate($ro-1);
}
#loader .ball-wrap:nth-child(1) .ball {
	animation: rotate3D-1 $sp-1 infinite linear;
}
#loader .ball-wrap:nth-child(1) .ball div {
	animation: counterRotate3D-1 $sp-1 infinite linear;
	background: $co-1;
}

// Ball #2
#loader .ball-wrap:nth-child(2) {
	animation:
		z2 $sp-2 infinite linear,
		ornt-2 $sp-2 infinite linear;
	// transform: rotate($ro-2);
}
#loader .ball-wrap:nth-child(2) .ball {
	animation: rotate3D-2 $sp-2 infinite linear;
}
#loader .ball-wrap:nth-child(2) .ball div {
	animation: counterRotate3D-2 $sp-2 infinite linear;
	background: $co-2;
}

// Ball #3
#loader .ball-wrap:nth-child(3) {
	animation:
		z3 $sp-3 infinite linear,
		ornt-3 $sp-3 infinite linear;
	// transform: rotate($ro-3);
}
#loader .ball-wrap:nth-child(3) .ball {
	animation: rotate3D-3 $sp-3 infinite linear;
}
#loader .ball-wrap:nth-child(3) .ball div {
	animation: counterRotate3D-3 $sp-3 infinite linear;
	background: $co-3;
}

// Ball #4
#loader .ball-wrap:nth-child(4) {
	animation:
		z4 $sp-4 infinite linear,
		ornt-4 $sp-4 infinite linear;
	// transform: rotate($ro-4);
}
#loader .ball-wrap:nth-child(4) .ball {
	animation: rotate3D-4 $sp-4 infinite linear;
}
#loader .ball-wrap:nth-child(4) .ball div {
	animation: counterRotate3D-4 $sp-4 infinite linear;
	background: $co-4;
}

// Ball #5
#loader .ball-wrap:nth-child(5) {
	animation:
		z5 $sp-5 infinite linear,
		ornt-5 $sp-5 infinite linear;
	// transform: rotate($ro-5);
}
#loader .ball-wrap:nth-child(5) .ball {
	animation: rotate3D-5 $sp-5 infinite linear;
}
#loader .ball-wrap:nth-child(5) .ball div {
	animation: counterRotate3D-5 $sp-5 infinite linear;
	background: $co-5;
}

/**
 * Rotation
 */

// Ball #1
@keyframes rotate3D-1 {
	0% {
		transform: rotate3d(0, 1, 0, 0deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, 360deg);
	}
}
@keyframes counterRotate3D-1 {
	0% {
		transform: rotate3d(0, 1, 0, 360deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, 0deg);
	}
}

// Ball #2
@keyframes rotate3D-2 {
	0% {
		transform: rotate3d(0, 1, 0, -72deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, 288deg);
	}
}
@keyframes counterRotate3D-2 {
	0% {
		transform: rotate3d(0, 1, 0, 72deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, -288deg);
	}
}

// Ball #3
@keyframes rotate3D-3 {
	0% {
		transform: rotate3d(0, 1, 0, -144deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, 216deg);
	}
}
@keyframes counterRotate3D-3 {
	0% {
		transform: rotate3d(0, 1, 0, 144deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, -216deg);
	}
}

// Ball #4
@keyframes rotate3D-4 {
	0% {
		transform: rotate3d(0, 1, 0, -216deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, 144deg);
	}
}
@keyframes counterRotate3D-4 {
	0% {
		transform: rotate3d(0, 1, 0, 216deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, -144deg);
	}
}

// Ball #5
@keyframes rotate3D-5 {
	0% {
		transform: rotate3d(0, 1, 0, -288deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, 72deg);
	}
}
@keyframes counterRotate3D-5 {
	0% {
		transform: rotate3d(0, 1, 0, 288deg);
	}
	100% {
		transform: rotate3d(0, 1, 0, -72deg);
	}
}

/**
 * Z-index management
 */

$wh: rgba(255, 255, 255, 0);
@keyframes z1 {
	60% {
		z-index: 0;
		// background: none;
	}
	60.1% {
		z-index: 1;
		// background: $wh;
	}
	// We switch at 95% instead of 80% to
	// avoid the balls from overlapping.
	95% {
		z-index: 1;
		// background: $wh;
	}
	95.1% {
		z-index: 0;
		// background: none;
	}
}
@keyframes z2 {
	80% {
		z-index: 0;
		// background: none;
	}
	80.1% {
		z-index: 1;
		// background: $wh;
	}
	100% {
		z-index: 1;
		// background: $wh;
	}
	0.1% {
		z-index: 0;
		// background: none;
	}
}
@keyframes z3 {
	0% {
		z-index: 0;
		// background: none;
	}
	0.1% {
		z-index: 1;
		// background: $wh;
	}
	20% {
		z-index: 1;
		// background: $wh;
	}
	20.1% {
		z-index: 0;
		// background: none;
	}
}
@keyframes z4 {
	20% {
		z-index: 0;
		// background: none;
	}
	20.1% {
		z-index: 1;
		// background: $wh;
	}
	40% {
		z-index: 1;
		// background: $wh;
	}
	40.1% {
		z-index: 0;
		// background: none;
	}
}
@keyframes z5 {
	40% {
		z-index: 0;
		// background: none;
	}
	40.1% {
		z-index: 1;
		// background: $wh;
	}
	60% {
		z-index: 1;
		// background: $wh;
	}
	60.1% {
		z-index: 0;
		// background: none;
	}
}

/**
 * Z-Rotation
 */

@keyframes ornt-1 {
	0% {
		transform: rotate(10deg);
	}
	100% {
		transform: rotate(370deg);
	}
}
@keyframes ornt-2 {
	0% {
		transform: rotate(266deg);
	}
	100% {
		transform: rotate(-94deg);
	}
}
@keyframes ornt-3 {
	0% {
		transform: rotate(298deg);
	}
	100% {
		transform: rotate(658deg);
	}
}
@keyframes ornt-4 {
	0% {
		transform: rotate(144deg);
	}
	100% {
		transform: rotate(-216deg);
	}
}
@keyframes ornt-5 {
	0% {
		transform: rotate(82deg);
	}
	100% {
		transform: rotate(442deg);
	}
}

// Every orientation starts with a multiplication of 72°,
// so at the start each ball is evenly distributed.
// - Orientation #1: 10deg = 0deg + 10
// - Orientation #2: 226deg = 216deg + 10 (ccw)
// - Orientation #3: 298deg = 288deg + 10
// - Orientation #4: 154deg = 144deg + 10 (ccw)
// - Orientation #5: 82deg = 72deg + 10
</style>
