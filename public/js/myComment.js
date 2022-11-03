const myComment = {
    data() {
        return {
            comments: [],
        };
    },
    methods: {
        onFormSubmit(e) {
            //  e.preventDefault(); or @submit.prevent
            const form = e.currentTarget;

            console.log(form.elements);

            fetch(`/api/images/${this.imageId}/comments`, {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    comment: form.elements.comment.value,
                    username: form.elements.username.value,
                }),
            })
                .then((result) => result.json())
                .then((newComment) => {
                    if (newComment) {
                        this.comments.unshift(newComment);
                    }
                });
        },
    },
    // every time my imageId changes this function will execute
    watch: {
        imageId: function (id) {
            console.log(id);
            fetch(`/api/images/${id}/comments`)
                // gets response as json file, response gets parsed/verifies that it's valid Json- gets converted to JS
                .then((response) => response.json())
                .then((comments) => {
                    this.comments = comments;
                });
        },
    },
    mounted() {
        fetch(`/api/images/${this.imageId}/comments`)
            // gets response as json file, response gets parsed/verifies that it's valid Json- gets converted to JS
            .then((response) => response.json())
            .then((comments) => {
                this.comments = comments;
            });
    },

    props: ["imageId"],

    template: `
    <div class="comment-wrapper">
   <div class="comments" v-for="c in comments">
      <p><em>@{{c.username}}</em>: {{c.comment}}</p>
   </div>
  
   
   <form class="add-comment"   @submit.prevent="onFormSubmit">
   <input name="username" type="text" placeholder="username">
<input type="text" placeholder="new comment" name="comment">
<input type="submit" value="Post" class="post ">

   </form>
 </div>
    `,
};

export default myComment;
