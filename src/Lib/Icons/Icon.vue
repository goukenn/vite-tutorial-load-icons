<script setup>
import { inject } from 'vue';
const props = defineProps({
    name: {
        type: 'String',
        required: true
    },
    library: {
        type: 'String',
        default: 'ionicons'
    }
});
const g = inject('lib/icons');
const { DefSVGIcon, lib } = ((g) => {
    const r = { DefSVGIcon: null, lib: null };
    if (g) {
        const lib = props.library || g.default || 'ionicons';
        r.lib = lib;
        r.DefSVGIcon = g && g.libicons ?
            g.libicons[lib][props.name]
            : null;
    }
    return r;
})(g); 
const classes = () => {
    function class_def(n) {
        return n.replace(/[^\w_\-]/g, '_').replace(/(_)+/, '_');
    }
    let cl = props.name;
    return ['svg-icons-container', class_def(lib), class_def(cl)].join(' ');
}
</script>
<template> 
    <span v-bind:className="classes()" v-if="DefSVGIcon">
        <DefSVGIcon></DefSVGIcon>
    </span> 
</template>