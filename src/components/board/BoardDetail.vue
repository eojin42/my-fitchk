<script setup>

</script>

<template>
    <div class="pb-2">
        <span class="small-title">상세정보</span>
    </div>
                    
    <table class="table board-article">
        <thead>
            <tr>
                <td colspan="2" class="text-center">
                    제목입니다.
                </td>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td width="50%">
                    작성자 : 홍길동
                </td>
                <td width="50%" class="text-end">
                    작성일 : 2025-05-01 | 조회 10
                </td>
            </tr>
            
            <tr>
                <td colspan="2" valign="top" class="article-content" height="200">
                    내용 입니다.
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    이전글 : 
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    다음글 : 
                </td>
            </tr>
        </tbody>
    </table>

    <div class="row mb-2">
        <div class="col-md-6 align-self-center">
            <button type="button" class="btn-default">수정</button>
            <button type="button" class="btn-default">삭제</button>
        </div>
        <div class="col-md-6 align-self-center text-end">
            <button type="button" class="btn-default">리스트</button>
        </div>
    </div>
</template>

<style scoped>

</style>