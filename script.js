$(document).ready(function () {
    $("#addReplyBtn").click(function () {
        var replyId = $("#replyId").val();
        var replyPassword = $("#replyPassword").val();
        var replyText = $("#replyText").val();

        var commentDiv = $("<div>").addClass("card mt-2");
        var cardBody = $("<div>").addClass("card-body").appendTo(commentDiv);
        $("<h5>").addClass("card-title").text(replyId).appendTo(cardBody);
        $("<p>").addClass("card-text").text(replyText).appendTo(cardBody);
        $("<button>").addClass("btn btn-danger deleteBtn").text("삭제").appendTo(cardBody).data("password", replyPassword);

        $("#comments").append(commentDiv);

        $("#replyId").val("");
        $("#replyPassword").val("");
        $("#replyText").val("");

        alert("저장 완료");
    });

    $(document).on("click", ".deleteBtn", function () {
        var password = prompt("비밀번호를 입력하세요:");
        var storedPassword = $(this).data("password");
        if (password === storedPassword) {
            $(this).closest(".card").remove();
            alert("댓글이 삭제되었습니다.");
        } else {
            alert("비밀번호가 일치하지 않습니다.");
        }
    });
});
