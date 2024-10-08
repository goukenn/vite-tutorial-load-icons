<template> 
    <div>
        <h2>SfSymbols </h2>
         <div class="bar">
        <!--
        <Icon name="eraser.fill" />
        <Icon name="square.and.arrow.up.badge.clock" />
        <Icon name="figure.roll" /> 
        -->
        </div>
    </div> 
    <div>
        <h2>ion icons </h2>
        <div> loading icons on productions
            <IonIcon name="add"></IonIcon>
            <IonIcon name="airplane-outline"></IonIcon> 
            <!-- <Icon name="add"/>
            <Icon name="airplane"/>
            <Icon name="airplane-outline"/> -->
        </div>
    </div>
</template>
<script setup>
import { defineAsyncComponent, ref} from 'vue';

const core = ref(0)
// import('./Lib/baba.js').then((o)=>{
//     console.log(o);
//     core.value = o.default.Pratical();
//     console.log('core in loading....', core.value);
    
// });
// let t = 'baba';
// load bar js 
// defineAsyncComponent(()=>import(`@/Lib/${t}.js`));

// import Icon from '@/Lib/Icons/SfSymbols'
// const Icon = defineAsyncComponent(() => import('@/Lib/Icons/SfSymbols'));
const IonIcon = defineAsyncComponent(() => import('@/Lib/Icons/ionicons'));

</script>