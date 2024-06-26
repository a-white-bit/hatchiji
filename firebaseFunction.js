// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    addDoc,
    collection,
    getDocs,
    getDoc,
    getFirestore,
    query,
    orderBy,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCqTdfpDiR5zq6AVRVkzDRK5ADqxSMrfxs",
    authDomain: "hatchiji.firebaseapp.com",
    projectId: "hatchiji",
    storageBucket: "hatchiji.appspot.com",
    messagingSenderId: "279150185406",
    appId: "1:279150185406:web:d07b8d0841c03d3fd0c7ef"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*댓글 불러오기*/
let docs = await getDocs(query(collection(db, "comments"), orderBy("createAt", "asc")));
let mapComments = {
    "소영": [],
    "성훈": [],
    "호진": [],
    "지연": []
};
docs.forEach((doc) => {
    let data = doc.data();

    let commentId = doc.id;
    let detail = data['detail'];
    let nickname = data['nickname'];
    let content = data['content'];
    let createAt = data['createAt'].toDate();
    let dateFormat = createAt.getFullYear() + "-" +
        ("0" + (createAt.getMonth() + 1)).slice(-2) + "-" +
        ("0" + createAt.getDate()).slice(-2) + " " +
        ("0" + createAt.getHours()).slice(-2) + ":" +
        ("0" + createAt.getMinutes()).slice(-2) + ":" +
        ("0" + createAt.getSeconds()).slice(-2);
    // 2024-04-04 17:10:06 형식

    let temp_comment = `
        <li class="comment-item">
            <input type="hidden" class="comment-id" value="${commentId}">
            <div class="comment-info">
                <div class="comment-nickname">${nickname}</div>
                <div class="comment-date">${dateFormat}</div>
            </div>
            <div class="comment-body">
                <div class="comment-content">${content}</div>
            </div>
            <div class="comment-delete-box">
                <input type="password" class="comment-password" placeholder="비밀번호" maxlength="8" size="8">
                <button type="button" class="comment-delete">삭제</button>
            </div>
        </li>
      `;
    mapComments[detail].push(temp_comment);
});
console.log(mapComments);

// 댓글 등록
$(".comment-add").on("click", async function () {
    let closestForm = $(this).closest(".comment-box");
    let detail = closestForm.find(".detail").val();
    let nickname = closestForm.find(".user-nickname").val();
    let password = closestForm.find(".user-password").val();
    let content = closestForm.find(".comment-input").val();
    let date = new Date();

    let addData = {
        "detail": detail,
        "nickname": nickname,
        "password": password,
        "content": content,
        "createAt": date
    };
    await addDoc(collection(db, "comments"), addData)
        .then(() => {
            alert("저장 완료");
            window.location.reload();
        })
        .error((error) => {
            alert("저장 실패")
            console.log("댓글 저장 실패 : ", error);
        });
});

// 댓글 삭제
$(document).on('click', '.comment-delete', async function () {
    let closestList = $(this).closest("li");
    let commentId = closestList.find(".comment-id").val();
    let password = closestList.find(".comment-password").val();
    console.log("입력 값\ncommentId : " + commentId + "\npassword : " + password);

    let deleteData = await getDoc(doc(db, "comments", commentId));
    if (password === deleteData.data().password) {
        await deleteDoc(doc(db, "comments", commentId))
            .then(function () {
                alert("삭제 완료");
                window.location.reload();
            }).catch(function (error) {
                alert("삭제 실패")
                console.log("댓글 삭제 실패 : ", error);
            });
    } else {
        alert("비밀번호 틀림");
    }
    closestList.find(".comment-password").val("");
});

$(".comment-items").empty();
mapComments["소영"].forEach((data) => {
    $("#tigerModal .comment-items").append(data);
});
mapComments["호진"].forEach((data) => {
    $("#catModal .comment-items").append(data);
});
mapComments["지연"].forEach((data) => {
    $("#mouseModal .comment-items").append(data);
});
mapComments["성훈"].forEach((data) => {
    $("#quokkaModal .comment-items").append(data);
});