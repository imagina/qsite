# Cropper
Implement the external package [vue-cropperjs](https://github.com/Agontuk/vue-cropperjs) as a component. This component is loaded by default in the master layout and listens to [EventBus](/docs/VueJs/modules/QSite/QsitePlugins#eventbus) events to work.

## Props

The props `object` contains all the Vue Cropper.js props to configure it.

## Usage

1. Import the `cropper` component and define it within your component:

    ```javascript
    import cropper from '@imagina/qsite/_components/master/cropper'
    ```

2. Use the `cropper` component in your template:

    ```jsx
    <cropper />
    ```

3. To send an image file to the component, dispatch an EventBus event named `master.cropper.image`. This will open a full modal with cropper actions:

    ```javascript
    this.$eventBus.$emit('master.cropper.image', {
      src: base64Image,
      type: filetype,
      callBack: (fileCropped) => {
        // Do anything with the cropped file...
      }
    });
    ```