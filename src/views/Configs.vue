<template>
<div>
    <div v-if="showConfigDialog">
        <v-card>
            <v-row gutters justify="space-around">
                <v-col cols="12" sm="5">
                    <v-alert border="top" color="red lighten-2" dark>配置明细</v-alert>
                    <v-jsoneditor v-model="config" :options="options" :plus="true" height="600px" />
                </v-col>
                <v-col cols="12" sm="5">
                    <v-alert border="right" color="blue-grey" dark>模式明细</v-alert>
                    <v-jsoneditor v-model="schema" :options="options" :plus="true" height="600px" />
                </v-col>
            </v-row>
            <v-card-actions>
                <v-btn color="primary" text @click="saveConfig">
                    保存
                </v-btn>
                <v-btn color="primary" text @click="cancelSaveConfig">
                    取消
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </div>
    <div v-if="showConfigPreviewDialog">
        <v-card>
            <v-row gutters justify="space-around">
                <v-col cols="12" sm="5">
                    <v-alert border="top" color="red lighten-2" dark>配置明细</v-alert>
                    <v-jsoneditor v-model="previewConfig" :options="options" :plus="true" height="600px" />
                </v-col>
                <v-col cols="12" sm="5">
                    <v-alert border="right" color="blue-grey" dark>模式明细</v-alert>
                    <v-jsoneditor v-model="previewSchema" :options="options" :plus="true" height="600px" />
                </v-col>
            </v-row>
            <v-card-actions>
                <v-btn color="primary" text @click="showConfigPreviewDialog = false">
                    取消
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </div>
    <v-data-table  v-if="!showConfigDialog && !showConfigPreviewDialog " :headers="headers" :items="envlist" class="elevation-1" :options.sync="options" :loading="loading">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>配置</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                            新建配置
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.name" label="配置名称"></v-text-field>
                                </v-row>
                                <v-row cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.desc" label="配置描述"></v-text-field>
                                </v-row>
                                <v-row cols="12" sm="6" md="4" v-if="editedIndex == -1">
                                    <v-text-field v-model="editedItem.key" label="配置密钥(为空会随机生成)"></v-text-field>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                                取消
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                                确定
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">确定删除该配置吗?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="enabledeploy" max-width="500px">
                    <v-card>
                        <v-card-title>
                            部署
                        </v-card-title>
                        <v-card-text>
                            <v-select :items="tags.taglist" item-value="id" item-text="tag" label="选择版本" solo v-model="tagId"></v-select>
                        </v-card-text>
                        <v-card-text>
                            <v-select :items="clusters" item-value="id" item-text="name" label="选择集群" solo v-model="clusterid"></v-select>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" text @click="enabledeploy = false">
                                取消
                            </v-btn>
                            <v-btn color="primary" text @click="deploy">
                                部署
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="buildTagDialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">新建版本</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row cols="12" sm="6" md="4">
                                    <v-text-field v-model="tags.editedItem.tag" label="版本号(例如: v1.0)"></v-text-field>
                                </v-row>
                                <v-row cols="12" sm="6" md="4">
                                    <v-text-field v-model="tags.editedItem.desc" label="版本描述"></v-text-field>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="buildTagDialog = false">
                                取消
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="buildTag">
                                确定
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="showTagsDialog" persistent max-width="1200px">
                    <v-card>
                        <v-card-title>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table :headers="tags.headers" :items="tags.taglist" class="elevation-1" :options.sync="tagsOptions" :loading="tags.loading">
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title>历史版本记录</v-toolbar-title>
                                        <v-divider class="mx-4" inset vertical></v-divider>
                                        <v-spacer></v-spacer>
                                        <v-spacer></v-spacer>
                                        <v-text-field v-model="tagsSearch" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                        <v-spacer></v-spacer>
                                        <v-dialog v-model="tags.dialogDelete" max-width="500px">
                                            <v-card>
                                                <v-card-title class="headline">确定删除该版本吗?</v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="blue darken-1" text @click="closeTagDelete">取消</v-btn>
                                                    <v-btn color="blue darken-1" text @click="deleteTagConfirm">确定</v-btn>
                                                    <v-spacer></v-spacer>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </v-toolbar>
                                </template>
                                <template v-slot:item.name="{ item }">
                                    <router-link :to="{path:'/app/env/'+item.id}">
                                        {{ item.name }}
                                    </router-link>
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon small class="mr-2" @click="previewTagItem(item)" v-bind="attrs" v-on="on">
                                                mdi-magnify-scan
                                            </v-icon>
                                        </template>
                                        <span>预览</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon small class="mr-2" @click="deleteTagItem(item)" v-bind="attrs" v-on="on">
                                                mdi-delete
                                            </v-icon>
                                        </template>
                                        <span>删除</span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:no-data>
                                    <v-btn color="primary" @click="initialize">
                                        Reset
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="showTagsDialog = false">
                                关闭
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
            {{ item.name }}
        </template>
        <template v-slot:item.config="{ item }">
            <v-btn color="primary" @click="showConfig(item)">
                配置
            </v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="mr-2" @click="showBuildTag(item)" v-bind="attrs" v-on="on">
                        mdi-tag
                    </v-icon>
                </template>
                <span>制作版本</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="mr-2" @click="showTags(item)" v-bind="attrs" v-on="on">
                        mdi-history
                    </v-icon>
                </template>
                <span>历史版本</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="mr-2" @click="showDeployConfgDialog(item)" v-bind="attrs" v-on="on">
                        mdi-grain
                    </v-icon>
                </template>
                <span>部署</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="mr-2" @click="editItem(item)" v-bind="attrs" v-on="on">
                        mdi-pencil
                    </v-icon>
                </template>
                <span>编辑</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="mr-2" @click="deleteItem(item)" v-bind="attrs" v-on="on">
                        mdi-delete
                    </v-icon>
                </template>
                <span>删除</span>
            </v-tooltip>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
                Reset
            </v-btn>
        </template>
    </v-data-table>
</div>
</template>

<script>

import {
    codemirror
} from 'vue-codemirror-lite'

export default {
    components: {
        codemirror
    },
    data: () => ({
        previewConfig: "",
        previewSchema: "",
        showConfigPreviewDialog: false,
        tagId: -1,
        buildTagDialog: false,
        showTagsDialog: false,
        clusterid: -1,
        clusters: [],
        enabledeploy: false,
        currentId: -1,
        showConfigDialog: false,
        config: "",
        schema: "",
        app_id: -1,
        env_id: -1,
        total: 0,
        loading: true,
        options: {},
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [{
                text: '配置名称',
                value: 'name',
                sortable: false,
            },
            {
                text: 'ENV KEY',
                value: 'key',
                sortable: false,
            },
            {
                text: '配置描述',
                value: 'desc',
                sortable: false,
            },
            {
                text: '配置信息',
                value: 'config',
                sortable: false,
            },
            {
                text: '创建时间',
                value: 'create_time'
            },
            {
                text: '更新时间',
                value: 'update_time'
            },
            {
                text: '操作',
                value: 'actions',
                sortable: false
            },
        ],
        envlist: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            desc: '',
            key: '',
        },
        defaultItem: {
            name: '',
            desc: '',
            key: '',
        },
        options: {
            mode: "code"
        },
        tagsSearch: "",
        tagsOptions: {
            "itemsPerPage": 10,
            "page": 0
        },
        tags: {
            total: 0,
            loading: true,
            options: {},
            search: '',
            dialog: false,
            dialogDelete: false,
            headers: [{
                    text: '版本号',
                    value: 'tag',
                    sortable: false,
                },
                {
                    text: '描述',
                    value: 'desc',
                    sortable: false,
                },
                {
                    text: '创建时间',
                    value: 'create_time'
                },
                {
                    text: '更新时间',
                    value: 'update_time'
                },
                {
                    text: '操作',
                    value: 'actions',
                    sortable: false
                },
            ],
            taglist: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                desc: '',
                key: '',
            },
            defaultItem: {
                name: '',
                desc: '',
                key: '',
            },
        }
    }),
    filters: {

    },
    mounted() {
        this.app_id = this.$route.params.app
        this.env_id = this.$route.params.env
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? '新建配置' : '编辑配置'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        options: {
            handler() {
                this.getDataFromApi()
            },
            deep: true,
        },
        search: {
            handler() {
                this.getDataFromApi()
            },
            deep: true,
        },
        tagsSearch: {
            handler() {
                this.getTagsFromApi(this.currentId)
            },
            deep: true,
        },
        tagsOptions: {
            handler() {
                this.getTagsFromApi(this.currentId)
            },
            deep: true,
        },
    },

    created() {
        // this.initialize()
    },

    methods: {
        initialize() {
            this.options.itemsPerPage = 10
            this.options.page = 0
            this.getDataFromApi()
        },
        getDataFromApi() {
            this.loading = true
            var _this = this
            this.$http.get('/api/v1/config/list', { // 还可以直接把参数拼接在url后边
                params: {
                    app: _this.app_id,
                    env: _this.env_id,
                    limit: _this.options.itemsPerPage,
                    offset: (_this.options.itemsPerPage) * (_this.options.page - 1),
                    filter: _this.search,
                }
            }).then(function (res) {
                console.log(res.data.data)
                var list = res.data.data
                for (var i = 0; i < list.length; i++) {
                    list[i]['create_time'] = _this.formatDate(list[i]['create_time'] * 1000)
                    list[i]['update_time'] = _this.formatDate(list[i]['update_time'] * 1000)
                }
                _this.total = 10
                _this.loading = false
                _this.envlist = res.data.data
            }).catch(function (error) {
                console.log(error);
            });

        },
        detailItem(item) {
            this.$router.push({
                path: '/app/config'
            })
        },
        editItem(item) {
            this.editedIndex = this.envlist.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.envlist.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteTagItem(item) {
            this.tags.editedIndex = this.tags.taglist.indexOf(item)
            this.tags.editedItem = Object.assign({}, item)
            this.tags.dialogDelete = true
            // this.currentId = item.id
        },

        deleteItemConfirm() {
            // this.envlist.splice(this.editedIndex, 1)
            this.closeDelete()
            var _this = this
            this.$http.delete('/api/v1/config/' + _this.envlist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
                params: {

                }
            }).then(function (res) {
                _this.getDataFromApi()
            }).catch(function (error) {
                console.log(error);
                alert(error.data.msg)
            });

        },

        deleteTagConfirm() {
            // this.envlist.splice(this.editedIndex, 1)
            this.closeTagDelete()
            var _this = this
            console.log(_this.tags.taglist)
            console.log(_this.tags.editedIndex)
            this.$http.delete('/api/v1/tag/' + _this.tags.taglist[_this.tags.editedIndex].id, { // 还可以直接把参数拼接在url后边
            }).then(function (res) {
                _this.getTagsFromApi(_this.currentId)
            }).catch(function (error) {
                console.log(error);
                alert(error.data.msg)
            });

        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            // this.$nextTick(() => {
            //     this.editedItem = Object.assign({}, this.defaultItem)
            //     this.editedIndex = -1
            // })
        },
        closeTagDelete() {
            this.tags.dialogDelete = false
            // this.$nextTick(() => {
            //     this.editedItem = Object.assign({}, this.defaultItem)
            //     this.editedIndex = -1
            // })
        },

        save() {
            if (this.editedIndex > -1) {
                //编辑
                // Object.assign(this.envlist[this.editedIndex], this.editedItem)
                var _this = this
                this.$http.put('/api/v1/config/base/' + _this.envlist[_this.editedIndex].id, {
                    name: _this.editedItem.name,
                    desc: _this.editedItem.desc,
                }).then(function (res) {
                    _this.getDataFromApi()
                }).catch(function (error) {
                    console.log(error);
                    alert(error.data.msg)
                });

            } else {
                //新建
                var _this = this
                this.$http.post('/api/v1/config/', { // 还可以直接把参数拼接在url后边
                    app: parseInt(_this.app_id),
                    env: parseInt(_this.env_id),
                    name: _this.editedItem.name,
                    desc: _this.editedItem.desc,
                    key: _this.editedItem.key,
                }).then(function (res) {
                    console.log(res.data.data)
                    _this.getDataFromApi()

                }).catch(function (error) {
                    console.log(error);
                });

                // this.envlist.push(this.editedItem)
            }
            this.close()
        },

        formatDate(value) {
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? ('0' + MM) : MM;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            let m = date.getMinutes();
            m = m < 10 ? ('0' + m) : m;
            let s = date.getSeconds();
            s = s < 10 ? ('0' + s) : s;
            return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        },
        showConfig(item) {
            console.log(item)
            if (item.config != "") {
                this.config = JSON.parse(item.config);
            }
            if (item.schema != "") {
                this.schema = JSON.parse(item.schema);
            }
            this.currentId = item.id
            this.showConfigDialog = true

        },
        saveConfig() {
            var _this = this
            this.$http.put('/api/v1/config/all/' + _this.currentId, {
                config: JSON.stringify(_this.config),
                schema: JSON.stringify(_this.schema)
            }).then(function (res) {
                _this.showConfigDialog = false
            }).catch(function (error) {
                console.log(error);
            });

        },
        cancelSaveConfig() {
            this.showConfigDialog = false
        },
        showDeployConfgDialog(item) {
            this.currentId = item.id
            //获取集群信息
            var _this = this
            this.getTagsFromApi(_this.currentId, 0, 10000)

            this.$http.get('/api/v1/cluster/list', { // 还可以直接把参数拼接在url后边
                limit: 100000,
            }).then(function (res) {
                console.log(res.data.data)
                var clusters = res.data.data
                for (var i = 0; i < clusters.length; i++) {
                    clusters[i]["name"] = clusters[i]["namespace"] + " -- " + clusters[i]["register"]
                }
                _this.clusters = clusters
                _this.enabledeploy = true
            }).catch(function (error) {
                console.log(error);
            });
        },
        deploy() {
            var _this = this
            this.$http.post('/api/v1/deploy/config', { // 还可以直接把参数拼接在url后边
                tag: _this.tagId,
                cluster: _this.clusterid,
            }).then(function (res) {
                console.log(res.data.data)
                if (res.data.code == 1002) {
                    alert("部署成功")
                } else {
                    alert(res.data.data)
                }
                _this.enabledeploy = false

            }).catch(function (error) {
                console.log(error);
                _this.enabledeploy = false

            });
        },

        // --------------------- tag --------------------
        showTags(item) {
            this.showTagsDialog = true
            this.currentId = item.id
            this.getTagsFromApi(item.id)
        },
        showBuildTag(item) {
            this.buildTagDialog = true
            this.currentId = item.id
            this.tags.editedItem.tag = ""
            this.tags.editedItem.desc = ""

        },
        buildTag() {
            var _this = this
            this.$http.post('/api/v1/tag', { // 还可以直接把参数拼接在url后边
                config: _this.currentId,
                tag: _this.tags.editedItem.tag,
                desc: _this.tags.editedItem.desc,
            }).then(function (res) {
                console.log(res.data.data)
                alert("新建成功")
                _this.buildTagDialog = false
            }).catch(function (error) {
                console.log(error);
            });
        },
        getTagsFromApi(config, offset, limit) {
            this.tags.loading = true
            var _this = this
            if (offset == undefined) {
                offset = (_this.tagsOptions.itemsPerPage) * (_this.tagsOptions.page - 1);
            }
            if (limit == undefined) {
                limit = _this.tagsOptions.itemsPerPage;
            }

            this.$http.get('/api/v1/tag/list', { // 还可以直接把参数拼接在url后边
                params: {
                    config: config,
                    limit: limit,
                    offset: offset,
                    filter: _this.tagsSearch,
                }
            }).then(function (res) {
                console.log(res.data.data)
                var list = res.data.data
                for (var i = 0; i < list.length; i++) {
                    list[i]['create_time'] = _this.formatDate(list[i]['create_time'] * 1000)
                    list[i]['update_time'] = _this.formatDate(list[i]['update_time'] * 1000)
                }
                _this.tags.total = 10
                _this.tags.loading = false
                _this.tags.taglist = res.data.data
            }).catch(function (error) {
                console.log(error);
            });

        },
        previewTagItem(item) {
            this.previewConfig = ""
            this.previewSchema = ""
            this.showConfigPreviewDialog = true
            var _this = this
            this.$http.get('/api/v1/tag/self/' + item.id, { // 还可以直接把参数拼接在url后边
            }).then(function (res) {
                _this.previewConfig = JSON.parse(res.data.data.config)
                _this.previewSchema = JSON.parse(res.data.data.schema)
            }).catch(function (error) {
                console.log(error);
                alert(error.data.msg)
            });
        }
    },

}
</script>

<style>
.CodeMirror {
    height: 600px;
}
</style>
