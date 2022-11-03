import myComment from "./myComment.js";

const myModal = {
    data() {
        return {};
    },
    // props passed down from parent to child, i.e. an image ID; actual props value needs to be put in html file
    // props: image-object, close-function
    props: ["image", "close", "previous", "next", "showNext", "showPrevious"],

    components: {
        "my-comment": myComment,
    },

    mounted() {
        console.log("our first component mounted");
    },
    // parent of this component is the main element, so that's where I have to render it
    // component is only allowed to have on root element, but inside of that one root element(wrapper) I can have
    //  several  sub divs etc.

    // if I add .self to click it will only be applied to the element itself, not its children, i.e. <p>
    // instead of vue.js's $emit(), I passed a callback fn from the parent as a prop,
    // i.e. close(which is how it works in React as well)
    // the comment component needs to be inside this template, since it is inside our Modal component
    template: `
    <div class="modal"  @click.self="close()">

        <button class="btn" v-if="showPrevious" @click="previous()"> &lt;</button>

        <div class="modal-wrapper">
            
           <div class="modal-img-wrapper"> 
           <button class="btn" @click="close()">X</button>
           <img  class="modalImg" v-bind:src="image.url" v-bind:alt="image.description">
           </div>
           <p>{{image.title}}</p> 
            <my-comment :image-id="image.id" v-if="image.id"></my-comment>
        </div>
        <button class="btn" v-if="showNext" @click="next()"> &gt;</button>
    </div>

    `,
};

export default myModal;
