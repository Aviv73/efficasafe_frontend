<template>
    <section class="about-hebrew-page">
        <page-header />
        <article
            class="about-hebrew-page-container"
            style="margin-bottom: 30px"
        >
            <h1 class="title" style="letter-spacing: -0.1px; margin-top: 40px">
                {{title}}
            </h1>
            <section>
                <p>
                    מנוע האינטרקציות <span class="highlight">Efficasafe</span>
                </p>
                <p>מציג חדשנות בעולם הטיפול הטבעי</p>
                <p>ומשדרג את יכולת הטיפול שלכם!</p>
            </section>
            <section>
                <p>
                    <a
                        style="text-decoration: underline"
                        href="/we-are-better-hebrew"
                        >הנה הסבר</a
                    >
                    מדוע <span class="highlight">Efficasafe</span> 
                </p>
                <p>הוא מנוע האינטרקציות הטוב ביותר בעולם.</p>
            </section>
            <section>
                <p>
                    בלינק
                    <a
                        href="https://youtu.be/mS8SAxD72ro"
                        style="text-decoration: underline"
                        >כאן</a
                    >
                    תוכלו לצפות בהדרכה
                </p>
                <p>שתלמד אתכם כיצד להשתמש באתר באופן מיטבי.</p>
            </section>
            <section>
                <p>האתר שמיש כמובן גם במובייל,</p>
                <p>אולם מומלץ להשתמש דרך המחשב</p>
                <p>על מנת למקסם את כל היישומים והאפשרויות.</p>
            </section>
            <section>
                <p>ההרשמה (sign up) מעניקה שימוש חופשי למשך שבועיים.</p>
            </section>
            <section v-if="routeName === 'Broshim'">
                <p>השימוש לבוגרי קמפוס ברושים הוא חינמי עד סוף השנה,</p>
                <p>לקבלת ההטבה יש לצפות בהדרכה, <a
                        href="https://broshim.unicko.com/meetings/300057100"
                        style="text-decoration: underline"
                        >כאן.</a
                    ></p>
            </section>
            <section v-else>
                <p>לאחר מכן תוכלו לרכוש מנוי מתחדש חודשי או שנתי</p>
                <p>ולקבל הנחה של למעלה מ20% על ידי שימוש בקופון discount22</p>
            </section>
            <section>
                <p>שמחים לשדרג את יכולות הטיפול שלכם,</p>
                <p>צוות <span class="highlight">Efficasafe</span></p>
            </section>
        </article>
    </section>
</template>

<script>
import PageHeader from '@/client/cmps/shared/PageHeader';

export default {
    name: 'WeAreBetterHebrew',
    components: {
        PageHeader,
    },
    computed:{
        title(){
            if(this.routeName === 'Broshim') return 'ברוכים הבאים בוגרי קמפוס ברושים'
            return 'באי כנס Inspiration ברוכים הבאים'
        },
        routeName(){
            return this.$route.name
        }
    }
};
</script>