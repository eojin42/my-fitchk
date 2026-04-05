<script setup>
import '@/assets/css/board.css'
import BoardList from '@/components/board/BoardList.vue';

</script>

<template>
	<div class="page-title">
		<div class="container align-items-center" data-aos="fade-up">
			<h1>자유 게시판</h1>
			<div class="page-title-underline-accent"></div>
		</div>
	</div>

  	<div class="section">
		<div class="container" data-aos="fade-up" data-aos-delay="100">
			<div class="row justify-content-center">
				<div class="col-md-10 board-section my-4 p-5">
					<BoardList/>
				</div>
			</div>
		</div>
	</div>
</template>
