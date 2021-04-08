<template>
  <section class="interaction-list">
      { "_id": "602a8fdc896d7e422c30e3ab-602a8fdc896d7e422c30b65a", "name": "Angelica sinensis & Warfarin", "recommendation": "Avoid coadministration", "evidenceLevel": "", "vInteractions": [ { "_id": "602a96c707e9974194c20217", "side1Material": { "_id": "602a8fdc896d7e422c30e3ab", "name": "Angelica sinensis", "type": "herb" }, "side2Material": { "_id": "602a8fdc896d7e422c30b65a", "name": "Warfarin", "type": "drug" }, "side2Label": null, "name": "Angelica sinensis & Warfarin", "recommendation": "Avoid coadministration", "evidenceLevel": "A", "isVirtual": true, "side2DraftName": "Anticoagulants" }, { "_id": "6033c59a6a5d233528c087cb", "side1Material": { "_id": "602a8fdc896d7e422c30e3ab", "name": "Angelica sinensis", "type": "herb" }, "side2Material": { "_id": "602a8fdc896d7e422c30b65a", "name": "Warfarin", "type": "drug" }, "side2Label": null, "side2DraftName": "", "recommendation": "Caution should be taken", "evidenceLevel": "", "refs": [], "isVirtual": false, "name": "Angelica sinensis & Warfarin", "order": 2 }, { "_id": "603371758c16bc2fc0849d17", "side1Material": { "_id": "602a8fdc896d7e422c30e3ab", "name": "Angelica sinensis", "type": "herb" }, "side2Material": { "_id": "602a8fdc896d7e422c30b65a", "name": "Warfarin", "type": "drug" }, "side2Label": null, "name": "Angelica sinensis & Warfarin", "recommendation": "Coadministration is possible", "evidenceLevel": "C", "isVirtual": true, "side2DraftName": "pathway related label" } ], "isCompoundGroup": false }, { "_id": "602a8fdc896d7e422c30e251-602a8fdc896d7e422c30b760", "name": "Cimicifuga racemosa & Acetylsalicylic acid", "recommendation": "Caution should be taken", "evidenceLevel": "A", "vInteractions": [ { "_id": "603fa5710fdf594290b72f74", "side1Material": { "_id": "602a8fdc896d7e422c30e251", "name": "Cimicifuga racemosa", "type": "herb" }, "side2Material": { "_id": "602a8fdc896d7e422c30b760", "name": "Acetylsalicylic acid", "type": "drug" }, "side2Label": null, "name": "Cimicifuga racemosa & Acetylsalicylic acid", "recommendation": "Caution should be taken", "evidenceLevel": "A", "isVirtual": true, "side2DraftName": "pain killaz - aspirinos" }, { "_id": "602a95fa07e9974194c2020d", "side1Material": { "_id": "602a8fdc896d7e422c30e251", "name": "Cimicifuga racemosa", "type": "herb" }, "side2Material": { "_id": "602a8fdc896d7e422c30b760", "name": "Acetylsalicylic acid", "type": "drug" }, "side2Label": null, "name": "Cimicifuga racemosa & Acetylsalicylic a
  </section>
</template>

<script>
export default {
    props: {
        listData: {
            type: Object,
            required: true
        }
    }
}
</script>