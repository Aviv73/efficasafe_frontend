<template>
    <section class="home">
        <header>
            <h1>
                <a href="/">
                    <img
                        src="@/client/assets/imgs/logo.png"
                        alt="Efficasafe Logo"
                    />
                </a>
                <span>
                    Optimizing <span class="keyword1">efficacy</span> and
                    <span class="keyword2">safety</span>
                    <span class="sub"> of integrated medical treatments </span>
                </span>
            </h1>
            <div class="home-container">
                <form @submit.prevent="" class="home-form">
                    <input type="text" placeholder="Search herb / drug" />
                    <input type="text" placeholder="Add another" />
                </form>
            </div>
        </header>
        <section class="home-stats">
            <div class="home-container">
                <ul class="flex-space-between">
                    <li>
                        <span>1,150</span>
                        Clinical trials
                    </li>
                    <li>
                        <span>48,000</span>
                        Pre-clinical trials
                    </li>
                    <li>
                        <span>93,414</span>
                        Articles
                    </li>
                </ul>
            </div>
            <div class="home-container">
                <p class="home-stats-quote">
                    Finally! One site with everything in it. I believe
                    that professionals have been waiting for something
                    like this to come along for a very long time.
                    <span>Dr. Jonathan Rosenzweig, MD</span>
                </p>
            </div>
        </section>
        <section class="home-content"></section>
    </section>
</template>

<script>

export default {
    name: 'Home'
};
</script>