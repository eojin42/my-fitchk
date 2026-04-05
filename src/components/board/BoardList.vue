<script setup>

</script>

<template>
    <div class="row py-1 mb-2">
        <div class="col-md-6 align-self-center">
            <span class="small-title">글목록</span> <span class="dataCount">75개(1/23 페이지)</span>
        </div>	
        <div class="col-md-6 align-self-center text-end">
        </div>
    </div>				

    <table class="table table-hover board-list">
        <thead>
            <tr>
                <th class="num">번호</th>
                <th class="subject">제목</th>
                <th class="name">글쓴이</th>
                <th class="date">작성일</th>
                <th class="hit">조회수</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td class="left">
                    <div class="text-wrap">
                        <a href="#">테스트 입니다.</a>
                    </div>
                </td>
                <td>스프링</td>
                <td>2025-05-05</td>
                <td>10</td>
            </tr>
        </tbody>					
    </table>

    <div class="page-navigation">
        1 2 3
    </div>

    <div class="row mt-3">
        <div class="col-md-3">
            <button class="btn-default" title="새로고침"><i class="bi bi-arrow-clockwise"></i></button>
        </div>
        <div class="col-md-6 text-center">
            <div class="form-search">
                <select>
                    <option value="all">제목+내용</option>
                    <option value="name">글쓴이</option>
                    <option value="reg_date">작성일</option>
                    <option value="subject">제목</option>
                    <option value="content">내용</option>
                </select>
                <input type="text">
                <button class="btn-default"><i class="bi bi-search"></i></button>
            </div>
        </div>
        <div class="col-md-3 text-end">
            <button type="button" class="btn-accent btn-md">글쓰기</button>
        </div>
    </div>

</template>

<style scoped>

</style>