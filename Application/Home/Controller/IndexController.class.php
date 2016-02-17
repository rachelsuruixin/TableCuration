<?php
namespace Home\Controller;
use Org\Util\String;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this->display();
    }
    public function left(){
        $this->display();
    }
    public function right(){
        $this->display();
    }

    public function upload(){
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =     3145728 ;// 设置附件上传大小
        $upload->exts      =     array('xml');// 设置附件上传类型
        $upload->rootPath  =     './Public/xmlFiles/'; // 设置附件上传根目录
        $upload->savePath  =     ''; // 设置附件上传（子）目录
        // 上传文件
        $info   =   $upload->upload();
         $path = null;
       // dump($info);
        if(!$info) {// 上传错误提示错误信息
            $this->error($upload->getError());
        }else{// 上传成功
            foreach($info as $file){
               $path[$file['key']] = $file['savepath'].$file['savename'];
            }
            $this->success('upload success！','xml_me.html?path1='.$path['file1'].'&path2='.$path['file2']);
        }
    }

    public function xml(){

        $filePath1 = 'Public/xmlFiles/'.$_GET['path1'];

        $xml_array1=simplexml_load_file($filePath1); //将XML中的数据,读取到数组对象中

        //循环全部的节点，将其中的xml对象转行成数组
        foreach($xml_array1->children() as $child)
        {

            $childName = (String)$child->getName(); //获取子节点

            switch($childName){
                case 'Authors':  // 获取作者信息
                    $Authors = array();
                    $key = 0;
                    foreach($child->children() as $author_info){
                        $Authors[$key] = (array)$author_info;
                        $key ++;
                    }
                    $this->assign('Authors1',$Authors);     //向html传值
                    break;
                case 'JournalInformation':
                    //dump($child);
                    $JournalInformation = array();
                    foreach($child->children() as $key => $JournalInformation_info){
                        $JournalInformation[$key] = $JournalInformation_info;
                    }
                    $this->assign('JournalInformation1',$JournalInformation);
                    break;

                case 'Tables':
                    $tb_info1 = array();
                    $key_tb = 0;
                    foreach($child->children() as $key_tb_children => $tb_info1_list){
                        $tb_info1[$key_tb] = (array)$tb_info1_list;
                        $tb_info1[$key_tb]['Cells'] = (array)$tb_info1[$key_tb]['Cells'];
                        $tb_info1[$key_tb]['Cells']['Cell']=(array)$tb_info1[$key_tb]['Cells']['Cell'];
                        $tb_info1[$key_tb]['Merges']=(array)$tb_info2[$key_tb]['Merges'];
                    //    $tb_info1[$key_tb]['Merges']['Merge']=(array)$tb_info2[$key_tb]['Merges']['Merge'];
                        foreach($tb_info1[$key_tb]['Cells']['Cell'] as $key => $tb_list){
                            $tb_info1[$key_tb]['Cells']['Cell'][$key] = (array)$tb_list;
                            $tb_info1[$key_tb]['Cells']['Cell'][$key]['Annotations'] = (array)$tb_info1[$key_tb]['Cells']['Cell'][$key]['Annotations'];
                            $tb_info1[$key_tb]['Cells']['Cell'][$key]['CellRoles'] = (array)$tb_info1[$key_tb]['Cells']['Cell'][$key]['CellRoles'];
                            // dump($tb_info1[$key_tb]['Cells']['Cell'][$key]['CellRoles']);
                            foreach($tb_info1[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'] as $key2 => $tb_info1_list_ann){
                                $tb_info1[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'][$key2] = (array) $tb_info1[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'][$key2];
                            }
                        }
                        if($tb_info1[$key_tb]['Merges']){
                            $tb_info1[$key_tb]['Merges']=(array)$tb_info1[$key_tb]['Merges'];
                            if(($tb_info1[$key_tb]['Merges']['Merge']->CellRowNum)){
                                $tb_info1[$key_tb]['Merges']['Merge']=[(array)$tb_info2[$key_tb]['Merges']['Merge']];
                            }else{
                                foreach($tb_info1[$key_tb]['Merges']['Merge'] as $key => $tb_list){
                                    $tb_info1[$key_tb]['Merges']['Merge'][$key] = (array)$tb_list;
                                }
                            }
                        }
                        
                        $key_tb ++;
                    }

                    $this->assign('tb_max_num1',$key_tb);
                    //dump($tb_info1);
                    $this->assign('tb_info1',$tb_info1);

                    break;
                case 'p-issn':
                    $this->assign('pissn1',$child);
                    break;
                case 'e-issn':
                    $this->assign('eissn1',$child);
                    break;
                default:
                    $this->assign($child->getName(),$child);
                    break;
            }



        }

//////////////////////////////////////////////////////////////////////////////////////



        $filePath2 = 'Public/xmlFiles/'.$_GET['path2'];

        $xml_array2=simplexml_load_file($filePath2); //将XML中的数据,读取到数组对象中

        //循环全部的节点，将其中的xml对象转行成数组
        foreach($xml_array2->children() as $child)
        {

            $childName = (String)$child->getName(); //获取子节点

            switch($childName){
                case 'Authors':  // 获取作者信息
                    $Authors = array();
                    $key = 0;
                    foreach($child->children() as $author_info){
                        $Authors[$key] = (array)$author_info;
                        $key ++;
                    }
                    $this->assign('Authors2',$Authors);     //向html传值
                    break;
                case 'JournalInformation':
                    //dump($child);
                    $JournalInformation = array();
                    foreach($child->children() as $key => $JournalInformation_info){
                        $JournalInformation[$key] = $JournalInformation_info;
                    }
                    $this->assign('JournalInformation2',$JournalInformation);
                    break;

                case 'Tables':
                    $tb_info2 = array();
                    $key_tb = 0;
                    foreach($child->children() as $key_tb_children => $tb_info2_list){
                        
                        $tb_info2[$key_tb] = (array)$tb_info2_list;
                        $tb_info2[$key_tb]['Cells'] = (array)$tb_info2[$key_tb]['Cells'];
                        $tb_info2[$key_tb]['Cells']['Cell']=(array)$tb_info2[$key_tb]['Cells']['Cell'];
                        foreach($tb_info2[$key_tb]['Cells']['Cell'] as $key => $tb_list){
                            $tb_info2[$key_tb]['Cells']['Cell'][$key] = (array)$tb_list;
                            $tb_info2[$key_tb]['Cells']['Cell'][$key]['Annotations'] = (array)$tb_info2[$key_tb]['Cells']['Cell'][$key]['Annotations'];
                            $tb_info2[$key_tb]['Cells']['Cell'][$key]['CellRoles'] = (array)$tb_info2[$key_tb]['Cells']['Cell'][$key]['CellRoles'];
                            foreach($tb_info2[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'] as $key2 => $tb_info2_list_ann){
                                $tb_info2[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'][$key2] = (array) $tb_info2[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'][$key2];
                            }
                        }
                        if($tb_info2[$key_tb]['Merges']){
                            $tb_info2[$key_tb]['Merges']=(array)$tb_info2[$key_tb]['Merges'];
                            if(($tb_info2[$key_tb]['Merges']['Merge']->CellRowNum)){
                                $tb_info2[$key_tb]['Merges']['Merge']=[(array)$tb_info2[$key_tb]['Merges']['Merge']];
                            }else{
                                foreach($tb_info2[$key_tb]['Merges']['Merge'] as $key => $tb_list){
                                    $tb_info2[$key_tb]['Merges']['Merge'][$key] = (array)$tb_list;
                                }
                            }
                        }
                        
                        $key_tb ++;
                    }
                    $this->assign('tb_max_num2',$key_tb);
                    $this->assign('tb_info2',$tb_info2);

                    break;
                case 'p-issn':
                    $this->assign('pissn2',$child);
                    break;
                case 'e-issn':
                    $this->assign('eissn2',$child);
                    break;
                default:
                    $this->assign($child->getName(),$child);
                    break;
            }

        }

        $this->assign('tb_id',0);

        $this->display();

    }
public function saveFile($fileName, $text) {
         if (!$fileName || !$text)
             return false;
 
             if ($fp = fopen($fileName, "w")) {
                 if (@fwrite($fp, $text)) {
                     fclose($fp);
                     return true;
                 } else {
                     fclose($fp);
                     return false;
                 } 
             } 
         return false;
     } 
    public function xmlright(){

        $filePath = 'Public/xmlFiles/'.$_GET['path'];
        $xml_array=simplexml_load_file($filePath); //将XML中的数据,读取到数组对象中

        //循环全部的节点，将其中的xml对象转行成数组
        foreach($xml_array->children() as $child)
        {
            //echo $child->getName() . ": " . $child . "<br />";

            $childName = (String)$child->getName(); //获取子节点

            switch($childName){
                case 'Authors':  // 获取作者信息
                    $Authors = array();
                    $key = 0;
                    foreach($child->children() as $author_info){
                        $Authors[$key] = (array)$author_info;
                        $key ++;
                    }
                    $this->assign('Authors',$Authors);     //向html传值
                    break;
                case 'JournalInformation':
                    //dump($child);
                    $JournalInformation = array();
                    foreach($child->children() as $key => $JournalInformation_info){
                        $JournalInformation[$key] = $JournalInformation_info;
                    }
                    $this->assign('JournalInformation',$JournalInformation);
                    break;

                case 'Tables':
                    $tb_info = array();
                    $key_tb = 0;
                    foreach($child->children() as $key_tb_children => $tb_info_list){
                        $tb_info[$key_tb] = (array)$tb_info_list;
                        $tb_info[$key_tb]['Cells'] = (array)$tb_info[$key_tb]['Cells'];
                        $tb_info[$key_tb]['Cells']['Cell']=(array)$tb_info[$key_tb]['Cells']['Cell'];
                        foreach($tb_info[$key_tb]['Cells']['Cell'] as $key => $tb_list){
                            $tb_info[$key_tb]['Cells']['Cell'][$key] = (array)$tb_list;
                            $tb_info[$key_tb]['Cells']['Cell'][$key]['Annotations'] = (array)$tb_info[$key_tb]['Cells']['Cell'][$key]['Annotations'];
                            $tb_info[$key_tb]['Cells']['Cell'][$key]['CellRoles'] = (array)$tb_info[$key_tb]['Cells']['Cell'][$key]['CellRoles'];

                            // dump($tb_info[$key_tb]['Cells']['Cell'][$key]['CellRoles']);
                            foreach($tb_info[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'] as $key => $tb_info_list_ann){
                                $tb_info[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'][$key] = (array) $tb_info[$key_tb]['Cells']['Cell'][$key]['Annotations']['Annotation'][$key];
                            }
                        }
                        $key_tb ++;
                    }

                    $this->assign('tb_max_num',$key_tb);
                    // dump($tb_info);
                    $this->assign('tb_info',$tb_info);

                    break;
                case 'p-issn':
                    $this->assign('pissn',$child);
                    break;
                case 'e-issn':
                    $this->assign('eissn',$child);
                    break;
                default:
                    $this->assign($child->getName(),$child);
                    break;
            }



        }

        // $this->assign('xml_array',$xml_array);

        //echo $tmp->name."-".$tmp->sex."-".$tmp->old."<br>";
        // }

        $this->assign('tb_id',0);

        $this->display();

    }

    public function xml_me(){
        $this->xml();
    }
    public function updatexml(){
        $filePath1 = 'Public/xmlFiles/'.$_GET['path1'];
        $cells=array();
        $filePath2 = 'Public/xmlFiles/'.$_GET['path2'];
        $changeList = $_POST['setList'];
        $mergeList  = $_POST['mergeList'];
        $xml_array2=simplexml_load_file($filePath1);
        foreach($xml_array2->children() as $child){
            $childName = (String)$child->getName();
            if ($childName=='Tables'){
                $key_tb = 0;
                foreach($child->children() as $key_tb_children => $tb_info2_list){
                    $changeList_table = $changeList[$key_tb];
                    $mergeList_table  = $mergeList[$key_tb];
                    foreach($tb_info2_list->Cells->Cell as $key => $tb_list){
                        $row = $tb_list->CellRowNum;
                        $col = $tb_list->CellColumnNum;
                        $cells[$row.','.$col]=$tb_list;
                    }
                    foreach($changeList_table as $command){
                        if($command){
                            $this->assign('return',$command);
                            $cells[$command[0].','.$command[1]]->CellValue=$command[2];
//                            dump($cells[$command[0].','.$command[1]]);
                        }
                    }
                    $merge_index=0;
                    foreach($tb_info2_list->Merges->Merge as $key =>$merge_list){
                        $row = $merge_list->CellRowNum;
                        $col = $merge_list->CellColumnNum;
                        $merges[$row.','.$col]=$merge_index;
                        $merge_index++;
                    }
                    
                    foreach($mergeList_table as $command){
                        if ($command){
                            
                            if($command[0]==0){
                                //demerge
                                $row=$command[1];
                                $col=$command[2];
                                unset($tb_info2_list->Merges->Merge[$merges[$row.','.$col]]);
                                
                            }else if($command[0]==1){
                                if(!$tb_info2_list->Merges){
                                    $tb_info2_list->addChild('Merges');
                                }
                                $newMerge = $tb_info2_list->Merges->addChild('Merge');
                                $newMerge->addChild('CellRowNum',$command[1]);
                                $newMerge->addChild('CellColumnNum',$command[2]);
                                $newMerge->addChild('RowSpan',$command[3]);
                                $newMerge->addChild('ColSpan',$command[4]);
                            }
                        }
                    }
                    $key_tb++;
                }
            }
        }
        
       if( ($xml_array2->asXML($filePath2))){
//	dump($this->saveFile('Public/xmlFiles'.$filePath2,$xml_array2->asXML()));
        $this->assign('return','success');
        }else{$this->assign('return','failed');}
        
        $this->display();
    }
}
