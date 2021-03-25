<template>
<div>
    <v-container fluid>
        <v-overlay :value="overlayAll"></v-overlay>
        <v-row>
            <v-col class="d-flex">
                <v-select :items="clusters" item-value="id" item-text="name" label="选择集群" solo v-model="clusterid"></v-select>
            </v-col>
        </v-row>
        <v-row v-if="cluster != null">
            <v-card :loading="loading" style="width: 100%;">
                <v-card-title>{{cluster.namespace}}</v-card-title>
                <v-card-text>
                    <div>{{cluster.description}}</div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-title>注册中心</v-card-title>
                <v-card-text> {{cluster.register}} </v-card-text>
                <v-card-title>在线服务数量 </v-card-title>
                <v-card-text> {{cluster.services!=null?cluster.services.length:0}} </v-card-text>
                <!-- <v-row style="width: 96%;margin-left: 2%;margin-bottom: 20px">
                    <v-col v-for="({ actionIcon, actionText, ...attrs }, i) in services" :key="i" cols="12" md="6" lg="4">
                        <material-stat-card v-bind="attrs" class="stat-card">
                            <template #actions>
                                <v-icon class="mr-3" small v-text="actionIcon" />
                                <div class="text-truncate">
                                    {{ actionText }}
                                </div>
                                <v-btn class="mx-2" fab dark color="primary" style="position: absolute;right: 10px;" @click="showService(attrs)">
                                    <v-icon dark>
                                        mdi-format-list-bulleted-square
                                    </v-icon>
                                </v-btn>
                            </template>
                        </material-stat-card>
                    </v-col>
                </v-row> -->
                <v-card>
                    <v-card-title>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="services" :search="search">
                        <template v-slot:item.mode="{ item }">
                            <v-chip dark v-if="item.mode == 'local'">
                                {{ item.mode }}
                            </v-chip>
                            <v-chip  v-else   color="primary">
                                {{ item.mode }}
                            </v-chip>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon blue @click="showService(item)">
                                mdi-format-list-bulleted-square
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card>
        </v-row>
    </v-container>
    <v-dialog v-model="serviceDetailDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-overlay :value="overlay"></v-overlay>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="serviceDetailDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>服务详情</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <!--       <v-btn dark text @click="serviceDetailDialog = false">
            </v-btn> -->
                </v-toolbar-items>
            </v-toolbar>
            <v-list three-line subheader>
                <v-subheader>服务信息</v-subheader>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>当前连接客户端数</v-list-item-title>
                        <v-list-item-subtitle>{{serviceDetailMap.client_count}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-row style="width: 96%;margin-left: 2%;margin-top: 20px">
                <v-col cols="12" md="6" lg="4">
                    <v-treeview rounded hoverable selectable return-object activatable open-on-click transition :items="serviceDetail" :active.sync="active" v-model="selects" selected-color="#2196f3" color="#2196f3"></v-treeview>
                    <v-btn depressed color="primary" style="margin-top: 30px;margin-left: 20px;" @click="deleteItem">
                        删除
                    </v-btn>
                </v-col>
                <v-col cols="12" md="6" lg="8" v-if="showType == 'config'">
                    <v-btn depressed color="primary" style="margin-top: 30px; margin-bottom: 10px;" @click="saveChange">
                        微调保存
                    </v-btn>
                    <v-alert type="warning">
                        微调会导致配置数据不一致和版本化明确，建议别调，走正式发布路线
                    </v-alert>
                    <v-jsoneditor v-model="configVal.data.val" :options="options" :plus="true" height="400px" />
                </v-col>
                <v-col cols="12" md="6" lg="8" v-if="showType == 'filter'">
                    <v-btn depressed color="primary" style="margin-top: 30px;margin-bottom: 10px;" @click="saveChange">
                        微调保存
                    </v-btn>
                    <v-alert type="warning">
                        微调会导致配置数据不一致和版本化不明确，建议走正式发布路线
                    </v-alert>
                    <codemirror v-model="filterVal.data.code" :options="{mode: 'lua', extraKeys: {'Ctrl-Space': 'autocomplete'},lineNumbers:true,theme:'mdn-like'}">
                    </codemirror>

                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
require('codemirror/mode/css/css')
require('codemirror/theme/mdn-like.css')
require('codemirror/mode/lua/lua')

import {
    deepClone
} from '../util/utils'

export default {
    data: () => ({
        search: '',
        headers: [{
                text: '序号',
                align: 'start',
                filterable: false,
                value: 'id',
            },
            {
                text: '服务地址',
                value: 'address'
            },
            {
                text: '服务类型',
                value: 'mode'
            },
            {
                text: '服务版本',
                value: 'version'
            },
            {
                text: '操作',
                value: 'actions'
            }
        ],
        overlayAll: false,
        overlay: false,
        currentService: "",
        selects: [],
        active: [],
        showType: "none",
        configVal: [],
        filterVal: "",
        serviceDetailDialog: false,
        loading: false,
        clusters: [],
        cluster: {
            name: "测试环境",
            desc: "描述1111111",
            register: "etcd://127.0.0.1/mconfig",
            servers: 100,
            status: [{
                    name: "正常",
                    color: "green"
                },
                {
                    name: "高可用",
                    color: "primary"
                },
            ]
        },
        options: {
            mode: "code"
        },
        clusterid: 0,
        services: [],
        service: [],
        serviceDetail: [],
        serviceDetailMap: {},
    }),
    mounted() {
        this.clusterid = parseInt(this.$route.params.cluster)
        this.getClusterList()
    },
    watch: {
        clusterid: {
            handler() {
                this.getClusterData()
            },
            deep: true,
        },
        active: {
            handler() {
                if (this.active.length == 1) {
                    this.filterVal = ""
                    this.configVal = []
                    console.log(this.active[0])
                    var select = this.active[0]
                    if (select.type == "config") {
                        this.showType = select.type;
                        var data = this.serviceDetailMap
                        console.log(data['apps'][select.app][select.env]['configs'][select.name])
                        this.configVal = data['apps'][select.app][select.env]['configs'][select.name]
                        this.configVal['data']['val'] = JSON.parse(this.configVal['data']['val'])
                    }
                    if (select.type == "filter") {
                        this.showType = select.type;
                        var data = this.serviceDetailMap
                        // this.filterVal = data['apps'][select.app][select.env]['filter']
                        console.log(data['apps'][select.app][select.env]['filter'])
                        var filter = data['apps'][select.app][select.env]['filter']
                        console.log(filter)
                        this.filterVal = filter
                    }
                }

            },
            deep: true,
        },
    },
    computed: {

    },
    methods: {
        getClusterList() {
            //获取集群列表
            var _this = this
            this.$http.get('/api/v1/cluster/list', { // 还可以直接把参数拼接在url后边
                limit: 100000,
            }).then(function (res) {
                console.log(res.data.data)
                var clusters = res.data.data
                for (var i = 0; i < clusters.length; i++) {
                    clusters[i]["name"] = clusters[i]["namespace"] + " -- " + clusters[i]["register"]
                }
                _this.clusters = clusters
            }).catch(function (error) {
                console.log(error);
            });
        },
        getClusterData() {
            //获取集群信息
            var _this = this
            this.$http.get('/api/v1/cluster/self/' + _this.clusterid, { // 还可以直接把参数拼接在url后边
            }).then(function (res) {
                _this.cluster = res.data.data
                if( _this.cluster == null){
                    _this.$message.error( res.data.msg);
                    return
                }
                _this.services = []
                if (_this.cluster.services != null) {
                    var servicesList = _this.cluster.services;
                    var services = []
                    for (var i = 0; i < servicesList.length; i++) {
                        var serviceMode = servicesList[i].metadata.mode
                        services.push({
                            id: i + 1,
                            version: "mconfig-server v1.0",
                            mode: serviceMode,
                            address: servicesList[i].address,
                        })
                    }
                    console.log("services:", services)
                    _this.services = services
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        showService(service) {
            console.log(service)
            //获取集群列表
            this.getServiceData(service.address)
        },
        filterOnlyCapsText(value, search, item) {
            return value != null &&
                search != null &&
                typeof value === 'string' &&
                value.toString().toLocaleUpperCase().indexOf(search) !== -1
        },

        getServiceData(address) {
            var _this = this
            _this.overlayAll = true
            this.$http.post('/api/v1/service/detail', { // 还可以直接把参数拼接在url后边
                cluster: _this.clusterid,
                service: address,
            }).then(function (res) {
                console.log(res.data.data)
                var data = res.data.data
                var serviceDetail = []
                var apps = data.apps
                var id = 0;

                for (var appKey in apps) {
                    var ser = {
                        id: id++,
                        name: "app: " + appKey,
                        children: [],
                    }
                    var envs = []
                    for (var envKey in apps[appKey]) {
                        var env = {
                            id: id++,
                            name: "env: " + envKey,
                            children: [],
                        }
                        var configs = []
                        for (var config in apps[appKey][envKey].configs) {
                            configs.push({
                                id: id++,
                                name: config,
                                app: appKey,
                                env: envKey,
                                type: "config",
                            })
                        }
                        // console.log(configs)
                        env.children.push({
                            id: id++,
                            name: 'configs',
                            children: configs,
                        })
                        env.children.push({
                            id: id++,
                            name: 'filter',
                            app: appKey,
                            env: envKey,
                            type: "filter",
                        })
                        envs.push(env)
                    }
                    ser.children = envs
                    serviceDetail.push(ser)

                }
                _this.serviceDetail = serviceDetail
                _this.serviceDetailDialog = true
                _this.serviceDetailMap = data

                _this.currentService = address
                _this.overlayAll = false
            }).catch(function (error) {
                console.log(error);
                _this.overlayAll = false
                _this.$message.error("服务信息获取失败或网络不可达到");
            });
        },

        saveChange() {
            var _this = this
            _this.overlay = true
            var app = ""
            var env = ""
            var filter = ""
            var config = ""
            var val = ""

            if (this.active.length == 1) {
                var select = this.active[0]
                app = select.app
                env = select.env

                if (select.type == "config") {
                    var data = this.serviceDetailMap
                    config = select.name
                    console.log(this.configVal)
                    var configVal = deepClone(this.configVal)
                    configVal['data']['val'] = JSON.stringify(configVal['data']['val'])
                    val = JSON.stringify(configVal)
                    filter = JSON.stringify(data['apps'][select.app][select.env]['filter'])
                }
                if (select.type == "filter") {
                    var data = this.serviceDetailMap
                    filter = JSON.stringify(this.filterVal)
                }
            }

            this.$http.post('/api/v1/service', {
                service: _this.currentService,
                app: app,
                env: env,
                filter: filter,
                config: config,
                configval: val,
            }).then(function (res) {
                console.log(res.data.data)
                _this.overlay = false
                // alert("微调成功")
                _this.$message({
                    message: '微调成功',
                    type: 'success'
                });
                _this.getServiceData(_this.currentService)
            }).catch(function (error) {
                _this.overlay = false
                console.log(error);
            });
        },
        deleteItem() {
            console.log(this.selects)
            var selects = this.selects
            for (var i = 0; i < selects.length; i++) {
                var select = selects[i]
                console.log(select)
                var _this = this
                this.$http.post('/api/v1/service/delete', { // 还可以直接把参数拼接在url后边
                    service: _this.currentService,
                    type: select.type,
                    app: select.app,
                    env: select.env,
                    config: select.name,
                }).then(function (res) {
                    console.log(res.data.data)
                    // alert("删除成功")
                    _this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    _this.getServiceData(_this.currentService)

                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
}
</script>

<style scoped="">
</style>
