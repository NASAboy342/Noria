<template>
    <div class="container">
        <div class="header">
                <h1 style="margin-top: unset;">វិក្កយបត្យ បន្ទប់ ទឹក ភ្លើង</h1>
        </div>
        <div class="content">
            <div class="flex">
                <div class="flex">
                    <p>លេខទូរស័ឰ</p>
                    <input type="text" class="input"/>
                </div>
                <div class="flex">
                    <p>បន្ទប់លេខ</p>
                    <input type="text" class="input"/>
                </div>
            </div>
            <div class="flex">
                <div class="flex">
                    <p>គិតចាប់ពីថ្ងៃទី</p>
                    <input type="text" class="input" style="width: 30px;"/>
                </div>
                <div class="flex">
                    <p>ខែ</p>
                    <input type="text" class="input" style="width: 30px;"/>
                </div>
                <div class="flex">
                    <p>ឆ្នាំ</p>
                    <input type="text" class="input" style="width: 30px;"/>
                </div>
                <div class="flex">
                    <p>ដល់ថ្ងៃទី</p>
                    <input type="text" class="input" style="width: 30px;"/>
                </div>
                <div class="flex">
                    <p>ខែ</p>
                    <input type="text" class="input" style="width: 30px;"/>
                </div>
                <div class="flex">
                    <p>ឆ្នាំ</p>
                    <input type="text" class="input" style="width: 30px;"/>
                </div>
            </div>
            <div class="table-wrap">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <p>លេខកត់ត្រាទឹក</p>
                                <div class="flex">
                                    <div>
                                        <p>លេខថ្មី</p>
                                        <input type="text" class="input"/>
                                    </div>
                                    <div>
                                        <p>លេខចាស់</p>
                                        <input type="text" class="input"/>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនm3</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1m3</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ថ្លៃទឹកសរុប</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>លេខកត់ត្រាភ្លើង</p>
                                <div class="flex">
                                    <div>
                                        <p>លេខថ្មី</p>
                                        <input type="text" class="input"/>
                                    </div>
                                    <div>
                                        <p>លេខចាស់</p>
                                        <input type="text" class="input"/>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនKw</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1Kw</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ថ្លៃភ្លើងសរុប</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="">
                                    <p>តំលៃបន្ទប់ជួល</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួនបន្ទប់</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>ចំនួន1បន្ទប់</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                            <td>
                                <div class="flex colomn center">
                                    <p>តំលៃបន្ទប់សរុប</p>
                                    <input type="text" class="input"/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <div class="flex center">
                                    <h3>តំលៃសរុបទាំងអស់</h3>
                                </div>
                            </td>
                            <td>
                                <div class="flex center">
                                    <h3>2345678</h3>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="footer">
            <div class="button negative">បកក្រោយ</div>
            <div class="button selected">រស្សារទុក</div>
            <div class="button focus">ព្រីន</div>
        </div>
    </div>
</template>

<style scoped lang="css">
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 10px;
}
.header{
    display: flex;
    justify-content: center;
}
.footer{
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.content{
    display: flex;
    flex-direction: column;
    gap: 10px;
}
table{
    border: 1px solid var(--border-color);
    border-collapse: collapse;
    width: 100%;
}
tr{
    border: 1px solid var(--border-color);
}
td{
    border: 1px solid var(--border-color);
    height: 100px;
    padding: 10px;
}
td input{
    height: 20px;
}
.table-wrap{
    display: flex;
    justify-content: center;
}
</style>