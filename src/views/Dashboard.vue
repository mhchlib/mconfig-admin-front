<template>
<v-container id="dashboard-view" fluid tag="section">
    <v-row>
        <v-col v-for="({ actionIcon, actionText, ...attrs }, i) in stats" :key="i" cols="12" md="6" lg="3">
            <material-stat-card v-bind="attrs">
                <template #actions>
                    <v-icon class="mr-2" small v-text="actionIcon" />
                    <div class="text-truncate">
                        {{ actionText }}
                    </div>
                </template>
            </material-stat-card>
        </v-col>

    </v-row>
</v-container>
</template>

<script>

export default {
    name: 'DashboardView',
    data: () => ({
        stats: [],
    }),

    computed: {},
    mounted() {
        var _this = this
        this.$http.get('/api/v1/dashboard', { // 还可以直接把参数拼接在url后边
        }).then(function (res) {
            console.log(res.data.data)
            var data = res.data.data
             _this.stats = [{
                    // actionIcon: 'mdi-alert',
                    // actionText: 'Get More Space...',
                    color: '#FD9A13',
                    icon: 'mdi-wall',
                    title: '应用',
                    value: data["app"]+"",
                },
                {
                    // actionIcon: 'mdi-tag',
                    // actionText: 'Tracked from Google Analytics',
                    color: 'primary',
                    icon: 'mdi-account',
                    title: '用户',
                    value: data["user"]+"",
                },
                {
                    // actionIcon: 'mdi-calendar-range',
                    // actionText: 'Last 24 Hours',
                    color: 'success',
                    icon: 'mdi-vector-difference',
                    title: '集群',
                    value: data["cluster"]+"",
                },
                {
                    // actionIcon: 'mdi-history',
                    // actionText: 'Just Updated',
                    color: 'info',
                    icon: 'mdi-focus-field',
                    title: '配置',
                    value: data["config"]+"",
                },
            ]
        });
    }
}
</script>
