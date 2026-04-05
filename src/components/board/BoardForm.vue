<script setup>

</script>

<template>
    <div class="pb-2">
        <span class="small-title">게시글 등록</span>
    </div>
        
    <table class="table write-form">
        <tbody>
            <tr>
                <td class="col-md-2 bg-light">제 목</td>
                <td>
                    <input type="text" class="form-control" maxlength="100" placeholder="Subject">
                </td>
            </tr>

            <tr>
                <td class="col-md-2 bg-light">이 름</td>
                <td>
                    <div class="row">
                        <div class="col-md-6">
                            <input type="text" class="form-control" readonly tabindex="-1">
                        </div>
                    </div>
                </td>
            </tr>
        
            <tr>
                <td class="col-md-2 bg-light">내 용</td>
                <td>
                    <textarea class="form-control" placeholder="Content"></textarea>
                </td>
            </tr>
        </tbody>
    </table>
    
    <div class="text-center">
        <button class="btn-accent btn-md">등록완료</button>
        <button class="btn-default btn-md">다시입력</button>
        <button class="btn-default btn-md">취 소</button>
    </div>				

</template>

<style scoped>

</style>