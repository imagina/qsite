# ckEditor
Implement the external package [vue-ckeditor-4](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_vue.html) as a component.

## Usage

1. Import the `ckEditor` component and define it within your component:

    ```javascript
    import ckEditor from '@imagina/qsite/_components/master/ckEditor'
    ```

2. Use the `ckEditor` component with the `v-model` directive to bind the content:

    ```jsx
    <ck-editor v-model="ckEditorData" />
    ```