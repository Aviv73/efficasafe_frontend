<template>
    <section class="about-hebrew-page">
        <page-header />
        
        <!--------------------- Inspiration ---------------------------->
        <article
            class="about-hebrew-page-container"
            style="margin-bottom: 30px"
            v-if="routeName === 'Inspiration'"
        >
            <h1 class="title" style="letter-spacing: -0.1px; margin-top: 40px">
                באי כנס Inspiration ברוכים הבאים
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
                <p>ביום ראשון הקרוב תיערך הדרכה,</p>
                <p>בין משתתפיה יוגרל מנוי שנתי חינם!</p>
                <p>הרשמה להדרכה ניתן לבצע <a
                        href="https://lp.vp4.me/q3mz"
                        target="_blank"
                        style="text-decoration: underline"
                        >כאן</a
                    >.</p>
            </section>
            <section>
                <p>פספסתם? לא יכולים להגיע?</p>
                <p>
                    בלינק
                    <a
                        href="https://youtu.be/mS8SAxD72ro"
                        target="_blank"
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
            <section>
                <p>לאחר מכן תוכלו לרכוש מנוי מתחדש חודשי או שנתי</p>
                <p>ולקבל הנחה של למעלה מ20% על ידי שימוש בקופון discount22</p>
            </section>
            <section>
                <p>שמחים לשדרג את יכולות הטיפול שלכם,</p>
                <p>צוות <span class="highlight">Efficasafe</span></p>
            </section>
        </article>
        <!--------------------- Inspiration ---------------------------->

        <!----------------------- Broshim ------------------------------>
        <article
            class="about-hebrew-page-container"
            style="margin-bottom: 30px"
            v-if="routeName === 'Broshim'"
        >
            <h1 class="title" style="letter-spacing: -0.1px; margin-top: 40px">
                ברוכים הבאים בוגרי קמפוס ברושים
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
                        href="https://vimeo.com/717438994/8b7ded4242"
                        target="_blank"
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
            <section>
                <p>השימוש לבוגרי קמפוס ברושים הוא חינמי עד סוף השנה,</p>
                <p>לקבלת ההטבה יש לצפות בהדרכה, <a
                        href="https://vimeo.com/717438994/8b7ded4242"
                        style="text-decoration: underline"
                        target="_blank"
                        >כאן.</a
                    ></p>
            </section>
            <section>
                <p>שמחים לשדרג את יכולות הטיפול שלכם,</p>
                <p>צוות <span class="highlight">Efficasafe</span></p>
            </section>
        </article>
        <!----------------------- Broshim ------------------------------>
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
        routeName(){
            return this.$route.name
        }
    }
};
</script>