import * as Vue from "./vue.js";
import myModal from "./myModal.js";

const app = Vue.createApp({
    data() {
        return {
            // Leave these here EMPTY because we will use them later
            images: [],

            selectedImage: null,
        };
    },

    methods: {
        deselectImage() {
            this.selectedImage = null;
        },
        deleteImage(imageId) {
            if (
                confirm("Are you sure you want to delete this image?") == true
            ) {
                // ${imageId} is a path parameter, according to rest api conventions
                fetch(`/api/images/${imageId}`, {
                    method: "delete",
                }).then((res) => {
                    // if it returns 200 it's been successfully deleted in the db, but not yet on the client side
                    if (res.status === 200) {
                        // if cb returns true that item will be kept, if cd returns false item,i.e. image, will be ommitted
                        this.images = this.images.filter(
                            (imgObj) => imgObj.id !== imageId
                        );
                    } else {
                        alert("Unable to delete image");
                    }
                });
            } else {
                return;
            }
        },
        selectPreviousImage() {
            console.log("select previous image");
            this.selectedImage--;
        },

        selectNextImage() {
            console.log("select next image");
            this.selectedImage++;
        },

        selectImage(index) {
            console.log("select image", index);
            this.selectedImage = index;
        },
        // on at the beginning of our fn name is a convention to imply (inter-)action
        // query parameter of last_id
        onShowMore() {
            const lastId = this.images[this.images.length - 1].id;
            fetch(`/api/images?last_id=${lastId}`)
                .then((response) => response.json())
                .then((images) => {
                    this.images = [...this.images, ...images];
                });
        },

        canShowMore() {
            if (!this.images.length) {
                return false;
            }
            const lastImage = this.images[this.images.length - 1];
            return lastImage.id !== lastImage.lowestId;
        },

        onFormSubmit(e) {
            //  e.preventDefault(); or @submit.prevent
            const form = e.currentTarget;
            const fileInput = form.querySelector("input[name=photo]");

            if (fileInput.files.length < 1) {
                alert("You must add a file!");
                return;
            }
            if (fileInput.files[0].size > 2097152) {
                alert("File is too big!Must be less than 2MB.");
                return;
            }
            // really submit the form!
            const formData = new FormData(form);
            fetch("/api/images", {
                method: "post",
                body: formData,
            })
                .then((result) => result.json())
                .then((serverData) => {
                    // update the view!
                    // by changing the value of data: message.
                    this.message = serverData.message;
                    // if there is an image, add it to the list in data!
                    if (serverData.image) {
                        this.images.unshift(serverData.image);
                    }
                });
        },
    },

    components: {
        // left hand side name of component of how it is rendered
        // right hand side the actual component that's been imported
        "my-modal": myModal,
    },
    // Run this when the Vue lifecycle MOUNTED event happens!
    mounted() {
        fetch("/api/images")
            .then((response) => response.json())
            .then((images) => {
                this.images = images;
            });
    },
});
app.mount("#main");
